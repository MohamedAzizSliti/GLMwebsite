import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { ApiService } from '../../../../services/api.service';

declare var bootstrap: any;

interface Quiz {
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
  selector: 'app-quiz-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-management.component.html',
  styleUrls: ['./quiz-management.component.scss']
})
export class QuizManagementComponent implements OnInit, OnChanges {
  @Input() courseId!: number;
  @Input() quizzes: Quiz[] = [];
  @Output() quizzesUpdated = new EventEmitter<Quiz[]>();

  String = String; // Make String available in the template
  quizForm!: FormGroup;
  isEditMode = false;
  currentQuiz: Quiz | null = null;
  isSaving = false;
  modal: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
    // Load quizzes when component initializes
    if (this.courseId) {
      this.loadQuizzes();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && changes['courseId'].currentValue) {
      this.loadQuizzes();
    }
  }

  initializeForm() {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      duration: [15, [Validators.required, Validators.min(1)]],
      total_marks: [20, [Validators.required, Validators.min(1)]],
      passing_marks: [12, [Validators.required, Validators.min(1)]],
      max_attempts: [3, [Validators.min(1)]],
      is_published: [false],
      shuffle_questions: [false],
      questions: this.fb.array([])
    });
  }

  get questionsArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
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

  openAddQuizModal() {
    this.isEditMode = false;
    this.currentQuiz = null;
    this.initializeForm();
    this.openModal();
  }

  editQuiz(quiz: Quiz) {
    this.isEditMode = true;
    this.currentQuiz = quiz;
    this.populateForm(quiz);
    this.openModal();
  }

  populateForm(quiz: Quiz) {
    this.quizForm.patchValue({
      title: quiz.title,
      description: quiz.description || '',
      duration: quiz.duration,
      total_marks: quiz.total_marks,
      passing_marks: quiz.passing_marks,
      max_attempts: quiz.max_attempts,
      is_published: quiz.is_published,
      shuffle_questions: quiz.shuffle_questions
    });

    // Clear existing questions
    while (this.questionsArray.length !== 0) {
      this.questionsArray.removeAt(0);
    }

    // Add existing questions
    if (quiz.questions) {
      quiz.questions.forEach(question => {
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
      marks: [question?.marks || 1, [Validators.min(1)]],
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

  saveQuiz() {
    if (this.quizForm.invalid) {
      this.markFormGroupTouched(this.quizForm);
      return;
    }

    this.isSaving = true;
    const formData = this.quizForm.value;

    const quizData = {
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

    if (this.isEditMode && this.currentQuiz) {
      this.updateQuiz(this.currentQuiz.id, quizData);
    } else {
      this.createQuiz(quizData);
    }
  }

  createQuiz(quizData: any) {
    this.apiService.createQuiz(this.courseId, quizData).subscribe({
      next: (response: any) => {
        console.log('Quiz created:', response);
        this.loadQuizzes();
        this.closeModal();
        this.showSuccess('Quiz créé avec succès');
      },
      error: (error) => {
        console.error('Error creating quiz:', error);
        this.showError('Erreur lors de la création du quiz');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  updateQuiz(quizId: number, quizData: any) {
    this.apiService.updateQuiz(quizId, quizData).subscribe({
      next: (response: any) => {
        console.log('Quiz updated:', response);
        this.loadQuizzes();
        this.closeModal();
        this.showSuccess('Quiz modifié avec succès');
      },
      error: (error) => {
        console.error('Error updating quiz:', error);
        this.showError('Erreur lors de la modification du quiz');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  deleteQuiz(quizId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      this.apiService.deleteQuiz(quizId).subscribe({
        next: () => {
          this.loadQuizzes();
          this.showSuccess('Quiz supprimé avec succès');
        },
        error: (error) => {
          console.error('Error deleting quiz:', error);
          this.showError('Erreur lors de la suppression du quiz');
        }
      });
    }
  }

  loadQuizzes() {
    if (!this.courseId) {
      console.warn('No courseId provided for loading quizzes');
      return;
    }

    this.apiService.getCourseQuizzes(this.courseId).subscribe({
      next: (response: any) => {
        console.log('Quizzes loaded from API:', response);
        // The API returns { quizzes: [...] }
        const quizzes = response.quizzes || [];
        this.quizzes = quizzes;
        this.quizzesUpdated.emit(this.quizzes);
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        // Fallback to current quizzes if API call fails
        this.quizzesUpdated.emit(this.quizzes);
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
    const modalElement = document.getElementById('quizModal');
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
