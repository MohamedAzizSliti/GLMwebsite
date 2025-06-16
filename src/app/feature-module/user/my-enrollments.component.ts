import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { routes } from '../../shared/routes/routes';
import { SharedModule } from '../../shared/shared-module';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.scss']
})
export class MyEnrollmentsComponent implements OnInit {
  public routes = routes;
  
  enrollments: any[] = [];
  isLoading = true;
  error: string | null = null;
  user: any;
  imageCache = new Map<string, boolean>();

  // Stats
  stats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    totalSpent: 0
  };

  constructor(
    private apiService: ApiService,
    private globalService: GlobalService,
    private router: Router
  ) {
    this.user = this.globalService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.error = null;

    if (!this.user || !this.user.id) {
      this.error = 'User not found. Please login again.';
      this.isLoading = false;
      return;
    }

    // Use the dashboard-user endpoint to get enrollments
    this.apiService.getDashboardUserData(this.user.id).subscribe({
      next: (data: any) => {
        console.log('Enrollments data:', data);
        
        if (data && data.enrollments) {
          this.enrollments = data.enrollments;

          // TEMPORARY: Add test data with completed courses for certificate testing
          if (this.enrollments.length === 0) {
            this.enrollments = [
              {
                id: 1,
                progress: 100,
                price_paid: 150,
                enrollment_date: new Date(),
                course: {
                  id: 1,
                  title: 'Formation HTML & CSS Avancé',
                  instructor: { name: 'Prof. Ahmed Benali' },
                  category: { name: 'Développement Web' },
                  duration: 40,
                  level: 'Intermédiaire',
                  price: 150,
                  media: [{
                    url: 'https://via.placeholder.com/400x300/007bff/ffffff?text=HTML+CSS'
                  }]
                }
              },
              {
                id: 2,
                progress: 75,
                price_paid: 200,
                enrollment_date: new Date(),
                course: {
                  id: 2,
                  title: 'JavaScript ES6 Moderne',
                  instructor: { name: 'Prof. Fatma Khelifi' },
                  category: { name: 'Programmation' },
                  duration: 50,
                  level: 'Avancé',
                  price: 200,
                  media: [{
                    url: 'https://via.placeholder.com/400x300/ffc107/000000?text=JavaScript'
                  }]
                }
              },
              {
                id: 3,
                progress: 100,
                price_paid: 180,
                enrollment_date: new Date(),
                course: {
                  id: 3,
                  title: 'React.js Fundamentals',
                  instructor: { name: 'Prof. Mohamed Trabelsi' },
                  category: { name: 'Framework' },
                  duration: 45,
                  level: 'Intermédiaire',
                  price: 180,
                  media: [{
                    url: 'https://via.placeholder.com/400x300/61dafb/000000?text=React'
                  }]
                }
              }
            ];
          }

          this.calculateStats();
          this.preloadImages();
        } else {
          this.enrollments = [];
        }
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading enrollments:', err);
        this.error = 'Failed to load your enrollments. Please try again.';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.enrollments.length;
    this.stats.completed = this.enrollments.filter(e => e.progress >= 100).length;
    this.stats.inProgress = this.enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    this.stats.notStarted = this.enrollments.filter(e => e.progress === 0).length;
    this.stats.totalSpent = this.enrollments.reduce((sum, e) => sum + (e.price_paid || e.course?.price || 0), 0);
  }

  getStatusBadgeClass(progress: number): string {
    if (progress >= 100) return 'badge-success';
    if (progress > 0) return 'badge-warning';
    return 'badge-secondary';
  }

  getStatusText(progress: number): string {
    if (progress >= 100) return 'Completed';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 100) return 'bg-success';
    if (progress >= 70) return 'bg-info';
    if (progress >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  continueCourse(enrollment: any): void {
    console.log('Continue course:', enrollment.course?.title);
  }

  viewCertificate(enrollment: any): void {
    console.log('viewCertificate called with enrollment:', enrollment);
    console.log('Progress:', enrollment.progress);

    if (enrollment.progress >= 100) {
      console.log('View certificate for:', enrollment.course?.title);

      const queryParams = {
        studentName: this.user?.name || 'Étudiant Certifié',
        courseName: enrollment.course?.title || 'Formation Complète',
        score: this.calculateFinalScore(enrollment),
        evaluation: this.getEvaluationText(enrollment),
        certificationDate: new Date().toLocaleDateString('fr-FR'),
        certificateId: this.generateCertificateId(enrollment)
      };

      console.log('Navigating to certificate with params:', queryParams);

      // Navigate to certificate page with enrollment data
      this.router.navigate(['/user/certificate'], {
        queryParams: queryParams
      }).then(success => {
        console.log('Navigation success:', success);
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      // Show message that course is not completed
      alert('🎓 Certificat non disponible\n\nVous devez terminer le cours à 100% pour obtenir votre certificat.\n\nProgression actuelle: ' + enrollment.progress + '%');
    }
  }

  unenrollFromCourse(enrollment: any): void {
    if (confirm(`Are you sure you want to unenroll from "${enrollment.course?.title}"?`)) {
      console.log('Unenroll from:', enrollment.course?.title);
    }
  }

  refreshEnrollments(): void {
    this.loadEnrollments();
  }

  // Test method for certificate functionality
  testCertificate(): void {
    console.log('Testing certificate navigation...');

    const testParams = {
      studentName: 'Test Student',
      courseName: 'Test Course',
      score: '95%',
      evaluation: '3/3 Réussi',
      certificationDate: new Date().toLocaleDateString('fr-FR'),
      certificateId: 'CERT-TEST-123456'
    };

    console.log('Test params:', testParams);

    this.router.navigate(['/user/certificate'], {
      queryParams: testParams
    }).then(success => {
      console.log('Test navigation success:', success);
    }).catch(error => {
      console.error('Test navigation error:', error);
    });
  }

  // Calculate final score based on enrollment progress and performance
  calculateFinalScore(enrollment: any): string {
    // If enrollment has quiz/exam results, use them
    if (enrollment.quiz_average) {
      return enrollment.quiz_average + '%';
    }

    // Otherwise, calculate based on progress
    if (enrollment.progress >= 100) {
      return '95%'; // Default excellent score for completed courses
    } else if (enrollment.progress >= 80) {
      return '85%';
    } else if (enrollment.progress >= 60) {
      return '75%';
    } else {
      return enrollment.progress + '%';
    }
  }

  // Get evaluation text based on enrollment
  getEvaluationText(enrollment: any): string {
    if (enrollment.progress >= 100) {
      return '3/3 Réussi';
    } else if (enrollment.progress >= 80) {
      return '2/3 Réussi';
    } else {
      return '1/3 Réussi';
    }
  }

  // Generate unique certificate ID
  generateCertificateId(enrollment: any): string {
    const courseId = enrollment.course?.id || 0;
    const userId = this.user?.id || 0;
    const timestamp = Date.now().toString().slice(-6);
    return `CERT-ESSECT-${courseId}${userId}${timestamp}`;
  }

  // Check if student can view certificate
  canViewCertificate(enrollment: any): boolean {
    return enrollment.progress >= 100;
  }

  // Get certificate button text
  getCertificateButtonText(enrollment: any): string {
    if (enrollment.progress >= 100) {
      return 'Voir le certificat';
    } else {
      return `Certificat (${enrollment.progress}%)`;
    }
  }

  getCourseImage(enrollment: any): string {
    // Return placeholder immediately if no course media
    if (!enrollment.course?.media?.[0]?.url) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTllY2VmIiByeD0iOCIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiM2Yzc1N2QiLz4KICA8cmVjdCB4PSIxODAiIHk9IjE1NSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMiIGZpbGw9IiM2Yzc1N2QiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iMTg1IiB5PSIxNjIiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzIiBmaWxsPSIjYWRiNWJkIiByeD0iMSIvPgo8L3N2Zz4=';
    }
    return enrollment.course.media[0].url;
  }

  onImageError(event: any): void {
    // Set placeholder image on error using inline SVG
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTllY2VmIiByeD0iOCIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiM2Yzc1N2QiLz4KICA8cmVjdCB4PSIxODAiIHk9IjE1NSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMiIGZpbGw9IiM2Yzc1N2QiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iMTg1IiB5PSIxNjIiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzIiBmaWxsPSIjYWRiNWJkIiByeD0iMSIvPgo8L3N2Zz4=';
  }

  onImageLoad(event: any): void {
    // Add fade-in effect and cache the successful load
    event.target.style.opacity = '1';
    const src = event.target.src;
    if (src && !src.includes('data:image')) {
      this.imageCache.set(src, true);
    }
  }

  preloadImages(): void {
    // Preload images in background to reduce lag
    this.enrollments.forEach(enrollment => {
      const imageUrl = enrollment.course?.media?.[0]?.url;
      if (imageUrl && !this.imageCache.has(imageUrl)) {
        const img = new Image();
        img.onload = () => this.imageCache.set(imageUrl, true);
        img.onerror = () => this.imageCache.set(imageUrl, false);
        img.src = imageUrl;
      }
    });
  }

  isImageCached(enrollment: any): boolean {
    const imageUrl = enrollment.course?.media?.[0]?.url;
    return imageUrl ? this.imageCache.has(imageUrl) : true;
  }
}
