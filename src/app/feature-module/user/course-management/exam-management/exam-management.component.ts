import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { ApiService } from '../../../../services/api.service';

declare var bootstrap: any;

interface Exam {
  id: number;
  title: string;
  description?: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  shuffle_questions: boolean;
  max_attempts: number;
  questions?: Question[];
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  marks: number;
  order: number;
}

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-management.component.html',
  styleUrls: ['./exam-management.component.scss']
})
export class ExamManagementComponent implements OnInit, OnChanges {
  @Input() courseId!: number;
  @Input() exams: Exam[] = [];
  @Output() examsUpdated = new EventEmitter<Exam[]>();

  String = String; // Make String available in the template
  examForm!: FormGroup;
  isEditMode = false;
  currentExam: Exam | null = null;
  isSaving = false;
  modal: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
    // Load exams when component initializes
    if (this.courseId) {
      this.loadExams();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && changes['courseId'].currentValue) {
      this.loadExams();
    }
  }

  initializeForm() {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      duration: [60, [Validators.required, Validators.min(1)]],
      total_marks: [100, [Validators.required, Validators.min(1)]],
      passing_marks: [60, [Validators.required, Validators.min(1)]],
      max_attempts: [1, [Validators.min(1)]],
      is_published: [false],
      shuffle_questions: [false],
      questions: this.fb.array([])
    });
  }

  get questionsArray(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getOptionsArray(questionIndex: number): FormArray {
    const questionGroup = this.questionsArray.at(questionIndex) as FormGroup;
    return questionGroup.get('options') as FormArray;
  }

  getQuestionType(questionIndex: number): string {
    const questionGroup = this.questionsArray.at(questionIndex) as FormGroup;
    return questionGroup.get('type')?.value || 'multiple_choice';
  }

  getOptionValue(questionIndex: number, optionIndex: number): string {
    const optionsArray = this.getOptionsArray(questionIndex);
    return optionsArray.at(optionIndex)?.value || '';
  }

  openAddExamModal() {
    this.isEditMode = false;
    this.currentExam = null;
    this.initializeForm();
    this.openModal();
  }

  editExam(exam: Exam) {
    this.isEditMode = true;
    this.currentExam = exam;
    this.populateForm(exam);
    this.openModal();
  }

  populateForm(exam: Exam) {
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description || '',
      duration: exam.duration,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      max_attempts: exam.max_attempts,
      is_published: exam.is_published,
      shuffle_questions: exam.shuffle_questions
    });

    // Clear existing questions
    while (this.questionsArray.length !== 0) {
      this.questionsArray.removeAt(0);
    }

    // Add existing questions
    if (exam.questions) {
      exam.questions.forEach(question => {
        this.questionsArray.push(this.createQuestionFormGroup(question));
      });
    }
  }

  createQuestionFormGroup(question?: Question): FormGroup {
    const questionGroup = this.fb.group({
      id: [question?.id || null],
      question: [question?.question || '', [Validators.required]],
      type: [question?.type || 'multiple_choice', [Validators.required]],
      correct_answer: [question?.correct_answer || '', [Validators.required]],
      marks: [question?.marks || 5, [Validators.min(1)]],
      options: this.fb.array([])
    });

    // Initialize options based on type
    const optionsArray = questionGroup.get('options') as FormArray;
    if (question?.type === 'multiple_choice' || question?.type === 'single_choice') {
      if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
          optionsArray.push(this.fb.control(option, [Validators.required]));
        });
      } else {
        // Default options for new multiple choice questions
        optionsArray.push(this.fb.control('', [Validators.required]));
        optionsArray.push(this.fb.control('', [Validators.required]));
      }
    } else if (question?.type === 'binary') {
      // For binary questions, add default Yes/No options
      optionsArray.push(this.fb.control('Oui', [Validators.required]));
      optionsArray.push(this.fb.control('Non', [Validators.required]));
    }

    return questionGroup;
  }

  addQuestionToForm() {
    const newQuestion = this.createQuestionFormGroup();
    this.questionsArray.push(newQuestion);
  }

  removeQuestionFromForm(index: number) {
    this.questionsArray.removeAt(index);
  }

  onQuestionTypeChange(questionIndex: number) {
    const questionGroup = this.questionsArray.at(questionIndex) as FormGroup;
    const type = questionGroup.get('type')?.value;
    const optionsArray = questionGroup.get('options') as FormArray;

    // Clear existing options
    while (optionsArray.length !== 0) {
      optionsArray.removeAt(0);
    }

    // Reset correct answer
    questionGroup.get('correct_answer')?.setValue('');

    // Add default options based on type
    if (type === 'multiple_choice' || type === 'single_choice') {
      optionsArray.push(this.fb.control('', [Validators.required]));
      optionsArray.push(this.fb.control('', [Validators.required]));
    } else if (type === 'binary') {
      optionsArray.push(this.fb.control('Oui', [Validators.required]));
      optionsArray.push(this.fb.control('Non', [Validators.required]));
    }
  }

  addOption(questionIndex: number) {
    const optionsArray = this.getOptionsArray(questionIndex);
    optionsArray.push(this.fb.control('', [Validators.required]));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const optionsArray = this.getOptionsArray(questionIndex);
    if (optionsArray.length > 2) {
      optionsArray.removeAt(optionIndex);
    }
  }

  saveExam() {
    if (this.examForm.invalid) {
      this.markFormGroupTouched(this.examForm);
      return;
    }

    this.isSaving = true;
    const formData = this.examForm.value;

    const examData = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      total_marks: formData.total_marks,
      passing_marks: formData.passing_marks,
      max_attempts: formData.max_attempts,
      is_published: formData.is_published,
      shuffle_questions: formData.shuffle_questions,
      questions: formData.questions.map((q: any) => ({
        question: q.question,
        type: q.type,
        options: (q.type === 'multiple_choice' || q.type === 'single_choice' || q.type === 'binary') ? q.options : null,
        correct_answer: q.correct_answer,
        marks: q.marks
      }))
    };

    if (this.isEditMode && this.currentExam) {
      this.updateExam(this.currentExam.id, examData);
    } else {
      this.createExam(examData);
    }
  }

  createExam(examData: any) {
    this.apiService.createExam(this.courseId, examData).subscribe({
      next: (response: any) => {
        console.log('Exam created:', response);
        this.loadExams();
        this.closeModal();
        this.showSuccess('Examen créé avec succès');
      },
      error: (error) => {
        console.error('Error creating exam:', error);
        this.showError('Erreur lors de la création de l\'examen');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  updateExam(examId: number, examData: any) {
    this.apiService.updateExam(examId, examData).subscribe({
      next: (response: any) => {
        console.log('Exam updated:', response);
        this.loadExams();
        this.closeModal();
        this.showSuccess('Examen modifié avec succès');
      },
      error: (error) => {
        console.error('Error updating exam:', error);
        this.showError('Erreur lors de la modification de l\'examen');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  deleteExam(examId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      this.apiService.deleteExam(examId).subscribe({
        next: () => {
          this.loadExams();
          this.showSuccess('Examen supprimé avec succès');
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
          this.showError('Erreur lors de la suppression de l\'examen');
        }
      });
    }
  }

  loadExams() {
    if (!this.courseId) {
      console.warn('No courseId provided for loading exams');
      return;
    }

    this.apiService.getCourseExams(this.courseId).subscribe({
      next: (response: any) => {
        console.log('Exams loaded from API:', response);
        // The API returns { exams: [...] }
        const exams = response.exams || [];
        this.exams = exams;
        this.examsUpdated.emit(this.exams);
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        // Fallback to current exams if API call fails
        this.examsUpdated.emit(this.exams);
      }
    });
  }

  getQuestionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'single_choice': 'Choix unique',
      'multiple_choice': 'Choix multiple',
      'binary': 'Oui/Non'
    };
    return labels[type] || type;
  }

  private openModal() {
    const modalElement = document.getElementById('examModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  private closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  private showSuccess(message: string) {
    console.log('Success:', message);
  }

  private showError(message: string) {
    console.error('Error:', message);
  }
}
