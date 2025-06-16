import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { AccessDataService } from "../../../services/access-data.service";
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalService } from "../../../services/global.service";
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-course',
  standalone: false,
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss'
})
export class AddCourseComponent {
  routes = routes;
  categories: any = [];
  isCreatingCourse = false;
  isUploadingCover = false;
  coverImagePreview: string | null = null;
  usingImageFallback = false; // Track if we're using data URL fallback
  
  // Multi-step form properties
  currentStep = 1;
  totalSteps = 4;
  steps = [
    { title: 'Informations', icon: 'isax-info-circle' },
    { title: 'Contenu', icon: 'isax-book-1' },
    { title: 'Prix', icon: 'isax-money-4' },
    { title: 'Révision', icon: 'isax-eye' }
  ];
  
  newCourse: {
    title: string;
    description: string;
    price: number | null;
    category_id: string;
    level: string;
    language: string;
    requirements: string;
    what_you_will_learn: string;
    is_featured: boolean;
    is_published: boolean;
    status: string;
    max_students: number | null;
    cover_image: string;
    duration: number | null;
    chapters: any[];
  } = {
    title: '',
    description: '',
    price: null,
    category_id: '',
    level: 'beginner',
    language: 'fr',
    requirements: '',
    what_you_will_learn: '',
    is_featured: false,
    is_published: false,
    status: 'draft',
    max_students: null,
    cover_image: '',
    duration: null,
    chapters: []
  };

  constructor(
    private accessDataService: AccessDataService,
    private ngxSpinner: NgxSpinnerService,
    private globaleService: GlobalService,
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('AddCourseComponent constructor called');
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        console.log('Categories response:', response);
        this.categories = response.data || response.categories || response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  // Media upload methods
  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('📁 File selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Client-side validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Format de fichier non supporté. Veuillez sélectionner un fichier JPG, PNG, GIF ou WebP.');
        event.target.value = ''; // Reset file input
        return;
      }
      
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille maximum: 5MB.');
        event.target.value = ''; // Reset file input
        return;
      }
      
      // File is valid, proceed with upload
      this.uploadCoverImage(file);
    }
  }

  uploadCoverImage(file: File) {
    console.log('🚀 Starting course cover upload (simplified)...');
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    // Check user authentication before upload
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error('❌ No user data found in localStorage');
      alert('Erreur: Vous devez être connecté pour uploader des images.');
      return;
    }
    
    let user;
    try {
      user = JSON.parse(userData);
      console.log('👤 User data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        hasToken: !!user.access_token,
        roles: user.roles
      });
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      alert('Erreur: Données utilisateur corrompues. Veuillez vous reconnecter.');
      return;
    }
    
    if (!user.access_token) {
      console.error('❌ No access token found');
      alert('Erreur: Token d\'authentification manquant. Veuillez vous reconnecter.');
      return;
    }
    
    // Check if user has teacher role
    const hasTeacherRole = user.roles ? 
      user.roles.some((role: any) => role.name === 'teacher' || role.name === 'TEACHER') :
      (user.role && (user.role.name === 'teacher' || user.role.name === 'TEACHER'));
    
    if (!hasTeacherRole) {
      console.error('❌ User does not have teacher role');
      alert('Erreur: Vous devez avoir le rôle de professeur pour uploader des images de cours.');
      return;
    }
    
    console.log('✅ Authentication checks passed, starting upload...');
    this.isUploadingCover = true;
    
    // Use the new simplified upload endpoint
    this.apiService.uploadCourseCoverSimple(file).subscribe({
      next: (response: any) => {
        console.log('✅ Course cover uploaded successfully (simplified):', response);
        
        if (response && response.success && response.cover_image_path) {
          // Store the path directly instead of media_id
          this.newCourse.cover_image = response.cover_image_path;
          
          // Always create a local preview first for immediate feedback
          this.createDataUrlFallback(file);
          
          // Set preview URL - try server URL but keep fallback if it fails
          if (response.full_url) {
            console.log('✅ Cover image path set successfully:', this.newCourse.cover_image);
            console.log('🔗 Attempting to load server URL:', response.full_url);
            
            // Try to load server URL in background, but don't wait for it
            this.tryServerImageUrl(response.full_url);
          } else {
            console.warn('⚠️ No full_url in response, using local preview only');
          }
          
        } else {
          console.error('❌ Invalid upload response: missing cover_image_path');
          console.log('📋 Full response:', response);
          alert('Erreur lors du traitement de l\'image uploadée.');
        }
      },
      error: (error) => {
        console.error('❌ Error uploading course cover:', error);
        console.log('📋 Full error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        let errorMessage = 'Erreur lors de l\'upload de l\'image. Veuillez réessayer.';
        
        if (error.status === 403) {
          errorMessage = 'Erreur: Vous devez avoir le rôle de professeur pour uploader des images de cours.';
        } else if (error.status === 422) {
          errorMessage = 'Erreur: Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP (max 5MB).';
        } else if (error.status === 401) {
          errorMessage = 'Erreur: Authentification requise. Veuillez vous reconnecter.';
        } else if (error.status === 0) {
          errorMessage = 'Erreur: Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else if (error.status === 413) {
          errorMessage = 'Erreur: Le fichier est trop volumineux. Taille maximum: 5MB.';
        } else if (error.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques instants.';
        } else {
          errorMessage = `Erreur lors de l'upload de l'image (${error.status}). Veuillez réessayer.`;
        }
        
        alert(errorMessage);
        
        // Reset upload state
        this.isUploadingCover = false;
        this.coverImagePreview = null;
        this.usingImageFallback = false;
      },
      complete: () => {
        console.log('🏁 Upload process completed');
        this.isUploadingCover = false;
      }
    });
  }

  removeCoverImage() {
    this.newCourse.cover_image = '';
    this.coverImagePreview = null;
    this.usingImageFallback = false;
  }

  // Helper method to try loading server image URL without blocking UX
  private tryServerImageUrl(url: string) {
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.warn('⏰ Server image loading timeout, keeping local preview');
    }, 2000); // Short timeout
    
    testImg.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Server image loaded successfully, switching to server URL');
      this.coverImagePreview = url;
      this.usingImageFallback = false;
    };
    
    testImg.onerror = (error) => {
      clearTimeout(timeout);
      console.warn('⚠️ Server image failed to load, keeping local preview');
      console.log('Server image error:', error);
      // Keep using the local preview that was already set
    };
    
    testImg.src = url;
  }

  // Helper method to handle image loading with CORS fallback
  private setImagePreview(url: string, fallbackFile: File) {
    console.log('🔍 Attempting to load image from URL:', url);
    
    // Always create a data URL fallback first for immediate preview
    this.createDataUrlFallback(fallbackFile);
    
    // Then try to load the server URL in the background
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous'; // Try to enable CORS
    
    // Set a timeout to avoid hanging
    const timeout = setTimeout(() => {
      console.warn('⏰ Image loading timeout, keeping data URL fallback');
    }, 3000); // Reduced timeout
    
    testImg.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Server image URL loaded successfully, switching to server URL');
      this.coverImagePreview = url;
      this.usingImageFallback = false;
    };
    
    testImg.onerror = (error) => {
      clearTimeout(timeout);
      console.warn('⚠️ Server image URL failed to load, keeping data URL fallback');
      console.log('Error details:', error);
      // Keep using the data URL fallback that was already set
    };
    
    testImg.src = url;
  }
  
  private createDataUrlFallback(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.coverImagePreview = e.target.result;
      this.usingImageFallback = true;
      console.log('✅ Data URL fallback created successfully');
    };
    reader.onerror = (error) => {
      console.error('❌ Failed to create data URL:', error);
      alert('Erreur lors de la création de l\'aperçu de l\'image.');
    };
    reader.readAsDataURL(file);
  }

  // Step navigation methods
  nextStep() {
    if (this.canProceedToNextStep() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.newCourse.title && this.newCourse.category_id);
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      case 4:
        return true;
      default:
        return false;
    }
  }

  // Helper methods for display
  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat: any) => cat.id == categoryId);
    return category ? category.name : '';
  }

  getLevelLabel(level: string): string {
    const levels: any = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé'
    };
    return levels[level] || level;
  }

  getLanguageLabel(language: string): string {
    const languages: any = {
      'fr': 'Français',
      'en': 'Anglais',
      'ar': 'Arabe'
    };
    return languages[language] || language;
  }

  createCourse() {
    if (!this.newCourse.title.trim()) {
      alert('Le titre du cours est requis.');
      return;
    }

    this.isCreatingCourse = true;
    
    // Prepare course data with proper formatting
    const courseData = {
      title: this.newCourse.title.trim(),
      description: this.newCourse.description || null,
      price: this.newCourse.price ? Number(this.newCourse.price) : null,
      category_id: this.newCourse.category_id ? Number(this.newCourse.category_id) : null,
      level: this.newCourse.level || 'beginner',
      language: this.newCourse.language || 'fr',
      requirements: this.newCourse.requirements || null,
      what_you_will_learn: this.newCourse.what_you_will_learn || null,
      is_featured: Boolean(this.newCourse.is_featured),
      is_published: Boolean(this.newCourse.is_published),
      status: this.newCourse.status || 'draft',
      max_students: this.newCourse.max_students ? Number(this.newCourse.max_students) : null,
      cover_image: this.newCourse.cover_image || null,
      duration: this.newCourse.duration ? Number(this.newCourse.duration) : null,
      chapters: this.newCourse.chapters || []
    };
    
    // Use the new simplified course creation endpoint
    this.apiService.createCourseSimple(courseData).subscribe({
      next: (response: any) => {
        console.log('Course created successfully (simplified):', response);
        
        // Reset form
        this.resetCourseForm();
        
        // Navigate back to courses list
        this.router.navigate(['/user/review']);
        
        // Show success message
        alert('Cours créé avec succès!');
      },
      error: (error) => {
        console.error('Error creating course:', error);
        console.log('Full error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        
        let errorMessage = 'Erreur lors de la création du cours. Veuillez réessayer.';
        
        if (error.status === 422) {
          console.error('Validation errors:', error.error?.details || error.error);
          errorMessage = 'Erreur de validation. Vérifiez les données saisies.';
          
          // Log specific validation errors
          if (error.error?.details) {
            console.error('Specific validation errors:', error.error.details);
          }
        } else if (error.status === 403) {
          errorMessage = 'Erreur: Vous devez avoir le rôle de professeur pour créer des cours.';
        } else if (error.status === 401) {
          errorMessage = 'Erreur: Authentification requise. Veuillez vous reconnecter.';
        } else if (error.status === 0) {
          errorMessage = 'Erreur: Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else if (error.status >= 500) {
          errorMessage = 'Erreur serveur. Consultez les logs pour plus de détails.';
        }
        
        alert(errorMessage);
        this.isCreatingCourse = false;
      },
      complete: () => {
        this.isCreatingCourse = false;
      }
    });
  }





  resetCourseForm() {
    this.currentStep = 1;
    this.coverImagePreview = null;
    this.newCourse = {
      title: '',
      description: '',
      price: null,
      category_id: '',
      level: 'beginner',
      language: 'fr',
      requirements: '',
      what_you_will_learn: '',
      is_featured: false,
      is_published: false,
      status: 'draft',
      max_students: null,
      cover_image: '',
      duration: null,
      chapters: []
    };
  }

  goBack() {
    this.router.navigate(['/user/review']);
  }
}
