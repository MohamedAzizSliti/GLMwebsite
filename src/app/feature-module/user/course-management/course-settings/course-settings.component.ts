import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../../../services/api.service';
import { routes } from '../../../../shared/routes/routes';

interface Course {
  id: number;
  title: string;
  description?: string;
  price?: number;
  level?: string;
  language?: string;
  category_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  cover_image?: string;
  preview_video?: string;
  enrollments?: any[];
  average_rating?: number;
  views?: number;
  created_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-course-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit, OnChanges {
  @Input() course!: Course;
  @Output() courseUpdated = new EventEmitter<Course>();

  @ViewChild('coverFileInput') coverFileInput!: ElementRef;
  @ViewChild('videoFileInput') videoFileInput!: ElementRef;

  courseForm!: FormGroup;
  categories: Category[] = [];
  isSaving = false;
  routes = routes;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCategories();
  }

  ngOnChanges() {
    if (this.course && this.courseForm) {
      this.populateForm();
    }
  }

  initializeForm() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      price: [0, [Validators.min(0)]],
      level: ['beginner'],
      language: ['fr'],
      category_id: [''],
      is_published: [false],
      is_featured: [false]
    });

    if (this.course) {
      this.populateForm();
    }
  }

  populateForm() {
    if (this.course) {
      this.courseForm.patchValue({
        title: this.course.title || '',
        description: this.course.description || '',
        price: this.course.price || 0,
        level: this.course.level || 'beginner',
        language: this.course.language || 'fr',
        category_id: this.course.category_id || '',
        is_published: this.course.is_published || false,
        is_featured: this.course.is_featured || false
      });
    }
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        // Ensure categories is always an array
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else if (response && Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = []; // Ensure it's always an array
      }
    });
  }

  saveCourse() {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    this.isSaving = true;
    const formData = this.courseForm.value;

    // Here you would typically call an API to update the course
    // For now, we'll simulate the update
    const updatedCourse = { ...this.course, ...formData };

    setTimeout(() => {
      this.courseUpdated.emit(updatedCourse);
      this.showSuccess('Cours mis à jour avec succès');
      this.isSaving = false;
    }, 1000);
  }

  triggerFileInput(type: 'cover' | 'video') {
    if (type === 'cover') {
      this.coverFileInput.nativeElement.click();
    } else {
      this.videoFileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any, type: 'cover' | 'video') {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically upload the file to your server
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (type === 'cover') {
          this.course.cover_image = e.target.result;
        } else {
          this.course.preview_video = e.target.result;
        }
        this.courseUpdated.emit(this.course);
      };
      reader.readAsDataURL(file);
    }
  }

  previewCourse() {
    // Navigate to course preview
    this.router.navigate([routes.hotelDetails, this.course.id]);
  }

  duplicateCourse() {
    if (confirm('Êtes-vous sûr de vouloir dupliquer ce cours ?')) {
      // Here you would call an API to duplicate the course
      this.showSuccess('Cours dupliqué avec succès');
    }
  }

  exportCourse() {
    // Here you would call an API to export course data
    this.showSuccess('Export en cours...');
  }

  deleteCourse() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      // Here you would call an API to delete the course
      this.showSuccess('Cours supprimé avec succès');
      // Navigate back to course list
      this.router.navigate([routes.review]);
    }
  }

  getFormattedDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
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
