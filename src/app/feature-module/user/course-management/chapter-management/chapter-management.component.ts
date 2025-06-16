import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { ApiService } from '../../../../services/api.service';

declare var bootstrap: any;

interface Chapter {
  id: number;
  title: string;
  description?: string;
  order: number;
  is_published: boolean;
  is_free: boolean;
  contents?: Content[];
}

interface Content {
  id: number;
  title: string;
  type: string;
  duration: number;
  serial_number: number;
  is_free: boolean;
  media_link?: string;
}

@Component({
  selector: 'app-chapter-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chapter-management.component.html',
  styleUrls: ['./chapter-management.component.scss']
})
export class ChapterManagementComponent implements OnInit {
  @Input() courseId!: number;
  @Input() chapters: Chapter[] = [];
  @Output() chaptersUpdated = new EventEmitter<Chapter[]>();

  chapterForm!: FormGroup;
  expandedChapter: number | null = null;
  isEditMode = false;
  currentChapter: Chapter | null = null;
  isSaving = false;
  modal: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.chapterForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      order: [this.chapters.length + 1, [Validators.min(1)]],
      is_published: [true],
      is_free: [false],
      contents: this.fb.array([])
    });
  }

  get contentsArray(): FormArray {
    return this.chapterForm.get('contents') as FormArray;
  }

  toggleChapter(chapterId: number) {
    this.expandedChapter = this.expandedChapter === chapterId ? null : chapterId;
  }

  openAddChapterModal() {
    this.isEditMode = false;
    this.currentChapter = null;
    this.initializeForm();
    this.openModal();
  }

  editChapter(chapter: Chapter) {
    this.isEditMode = true;
    this.currentChapter = chapter;
    this.populateForm(chapter);
    this.openModal();
  }

  populateForm(chapter: Chapter) {
    this.chapterForm.patchValue({
      title: chapter.title,
      description: chapter.description || '',
      order: chapter.order,
      is_published: chapter.is_published,
      is_free: chapter.is_free
    });

    // Clear existing contents
    while (this.contentsArray.length !== 0) {
      this.contentsArray.removeAt(0);
    }

    // Add existing contents
    if (chapter.contents) {
      chapter.contents.forEach(content => {
        this.contentsArray.push(this.createContentFormGroup(content));
      });
    }
  }

  createContentFormGroup(content?: Content): FormGroup {
    return this.fb.group({
      id: [content?.id || null],
      title: [content?.title || '', [Validators.required]],
      type: [content?.type || 'video', [Validators.required]],
      duration: [content?.duration || 0, [Validators.min(0)]],
      is_free: [content?.is_free || false],
      media_link: [content?.media_link || '']
    });
  }

  addContentToForm() {
    this.contentsArray.push(this.createContentFormGroup());
  }

  removeContentFromForm(index: number) {
    this.contentsArray.removeAt(index);
  }

  saveChapter() {
    if (this.chapterForm.invalid) {
      this.markFormGroupTouched(this.chapterForm);
      return;
    }

    this.isSaving = true;
    const formData = this.chapterForm.value;

    const chapterData = {
      title: formData.title,
      description: formData.description,
      order: formData.order,
      is_published: formData.is_published,
      is_free: formData.is_free,
      contents: formData.contents
    };

    if (this.isEditMode && this.currentChapter) {
      this.updateChapter(this.currentChapter.id, chapterData);
    } else {
      this.createChapter(chapterData);
    }
  }

  createChapter(chapterData: any) {
    this.apiService.createChapter(this.courseId, chapterData).subscribe({
      next: (response: any) => {
        console.log('Chapter created:', response);
        this.loadChapters();
        this.closeModal();
        this.showSuccess('Chapitre créé avec succès');
      },
      error: (error) => {
        console.error('Error creating chapter:', error);
        this.showError('Erreur lors de la création du chapitre');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  updateChapter(chapterId: number, chapterData: any) {
    this.apiService.updateChapter(chapterId, chapterData).subscribe({
      next: (response: any) => {
        console.log('Chapter updated:', response);
        this.loadChapters();
        this.closeModal();
        this.showSuccess('Chapitre modifié avec succès');
      },
      error: (error) => {
        console.error('Error updating chapter:', error);
        this.showError('Erreur lors de la modification du chapitre');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  deleteChapter(chapterId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) {
      this.apiService.deleteChapter(chapterId).subscribe({
        next: () => {
          this.loadChapters();
          this.showSuccess('Chapitre supprimé avec succès');
        },
        error: (error) => {
          console.error('Error deleting chapter:', error);
          this.showError('Erreur lors de la suppression du chapitre');
        }
      });
    }
  }

  addContent(chapterId: number) {
    // Implementation for adding content to existing chapter
    console.log('Add content to chapter:', chapterId);
  }

  editContent(content: Content) {
    // Implementation for editing content
    console.log('Edit content:', content);
  }

  deleteContent(contentId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      this.apiService.deleteContent(contentId).subscribe({
        next: () => {
          this.loadChapters();
          this.showSuccess('Contenu supprimé avec succès');
        },
        error: (error) => {
          console.error('Error deleting content:', error);
          this.showError('Erreur lors de la suppression du contenu');
        }
      });
    }
  }

  loadChapters() {
    this.apiService.getCourseChapters(this.courseId).subscribe({
      next: (chapters: Chapter[]) => {
        this.chapters = chapters;
        this.chaptersUpdated.emit(this.chapters);
      },
      error: (error) => {
        console.error('Error loading chapters:', error);
      }
    });
  }

  getContentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'video': 'isax-video-play',
      'text': 'isax-document-text',
      'pdf': 'isax-document-download',
      'audio': 'isax-music'
    };
    return icons[type] || 'isax-document';
  }

  getContentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'video': 'Vidéo',
      'text': 'Texte',
      'pdf': 'PDF',
      'audio': 'Audio'
    };
    return labels[type] || type;
  }

  private openModal() {
    const modalElement = document.getElementById('chapterModal');
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
      }
    });
  }

  private showSuccess(message: string) {
    // Implement toast notification
    console.log('Success:', message);
  }

  private showError(message: string) {
    // Implement toast notification
    console.error('Error:', message);
  }
}
