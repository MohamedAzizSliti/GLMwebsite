import { Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { GlobalService } from '../../../services/global.service';
import jsPDF from 'jspdf';

export interface StudentCertification {
  studentName: string;
  email: string;
  quizzesCompleted: number;
  totalQuizzes: number;
  averageScore: number; // percentage
  isCertified: boolean;
  courseName?: string;
  certificationDate?: Date;
}

export interface UserFeedback {
  rating: number;
  comment: string;
  quickReaction: string;
  submittedAt?: Date;
}

@Component({
  selector: 'app-certification-management',
  standalone: false,
  templateUrl: './certification-management.component.html',
  styleUrl: './certification-management.component.scss'
})
export class CertificationManagementComponent implements OnInit {
  routes = routes;
  user: any;

  // User feedback object
  userFeedback: UserFeedback = {
    rating: 0,
    comment: '',
    quickReaction: ''
  };

  // Static certification data
  studentCertifications: StudentCertification[] = [
    { 
      studentName: 'Ahmed B.', 
      email: 'ahmed@email.com', 
      quizzesCompleted: 3, 
      totalQuizzes: 3, 
      averageScore: 88, 
      isCertified: false,
      courseName: 'HTML/CSS Avancé'
    },
    { 
      studentName: 'Fatma K.', 
      email: 'fatma@email.com', 
      quizzesCompleted: 2, 
      totalQuizzes: 3, 
      averageScore: 75, 
      isCertified: false,
      courseName: 'JavaScript ES6'
    },
    { 
      studentName: 'Lina T.', 
      email: 'lina@email.com', 
      quizzesCompleted: 3, 
      totalQuizzes: 3, 
      averageScore: 92, 
      isCertified: true,
      courseName: 'React Fundamentals',
      certificationDate: new Date('2024-03-15')
    },
    { 
      studentName: 'Mohamed S.', 
      email: 'mohamed@email.com', 
      quizzesCompleted: 3, 
      totalQuizzes: 3, 
      averageScore: 95, 
      isCertified: true,
      courseName: 'Node.js Backend',
      certificationDate: new Date('2024-03-10')
    },
    { 
      studentName: 'Amina R.', 
      email: 'amina@email.com', 
      quizzesCompleted: 2, 
      totalQuizzes: 3, 
      averageScore: 68, 
      isCertified: false,
      courseName: 'Database Design'
    },
    { 
      studentName: 'Youssef M.', 
      email: 'youssef@email.com', 
      quizzesCompleted: 3, 
      totalQuizzes: 3, 
      averageScore: 89, 
      isCertified: false,
      courseName: 'Python Programming'
    }
  ];

  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getCurrentUser();
  }

  ngOnInit(): void {
    // Show congratulations modal after a short delay
    setTimeout(() => {
      this.showCongratulationsModal();
    }, 1000);
  }

  // Show congratulations modal
  showCongratulationsModal(): void {
    // Check if user has recently achieved certification (simulate condition)
    const hasRecentCertification = this.studentCertifications.some(s => s.isCertified);
    
    if (hasRecentCertification) {
      // Use Bootstrap modal API
      const modalElement = document.getElementById('congratulationsModal');
      if (modalElement) {
        // @ts-ignore
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  // Set rating for feedback
  setRating(rating: number): void {
    this.userFeedback.rating = rating;
  }

  // Set quick reaction
  setQuickReaction(reaction: string): void {
    this.userFeedback.quickReaction = this.userFeedback.quickReaction === reaction ? '' : reaction;
  }

  // Submit feedback
  submitFeedback(): void {
    this.userFeedback.submittedAt = new Date();
    
    // Log feedback (in real app, send to backend)
    console.log('User Feedback Submitted:', this.userFeedback);
    
    // Show success message
    alert(`🎉 Merci pour votre feedback ! 
    
⭐ Note: ${this.userFeedback.rating}/5
${this.userFeedback.quickReaction ? '🚀 Réaction: ' + this.getReactionText(this.userFeedback.quickReaction) : ''}
${this.userFeedback.comment ? '💭 Commentaire: ' + this.userFeedback.comment : ''}

Votre avis nous aide à améliorer l'expérience d'apprentissage ! 🌟`);
    
    // Close modal
    const modalElement = document.getElementById('congratulationsModal');
    if (modalElement) {
      // @ts-ignore
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    
    // Reset feedback form
    this.resetFeedbackForm();
  }

  // Print user's certificate
  printMyCertificate(): void {
    // Find the first certified student (or create a sample for current user)
    let certifiedStudent = this.studentCertifications.find(s => s.isCertified);
    
    if (!certifiedStudent) {
      // Create a sample certificate for the current user
      certifiedStudent = {
        studentName: this.user?.name || 'Utilisateur Certifié',
        email: this.user?.email || 'user@goldlms.com',
        quizzesCompleted: 3,
        totalQuizzes: 3,
        averageScore: 95,
        isCertified: true,
        courseName: 'Formation Complète Gold LMS',
        certificationDate: new Date()
      };
    }
    
    // Generate PDF certificate
    this.generatePdfCertificate(certifiedStudent);
    
    // Show success message
    alert(`🎉 Votre certificat est en cours de téléchargement ! 
    
📄 Le certificat PDF sera sauvegardé dans vos téléchargements.
🎓 Félicitations pour votre réussite ! 
    
Vous pouvez maintenant partager votre certificat avec fierté ! 🌟`);
    
    // Close modal after a short delay
    setTimeout(() => {
      const modalElement = document.getElementById('congratulationsModal');
      if (modalElement) {
        // @ts-ignore
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }, 2000);
  }

  // Get reaction text for display
  private getReactionText(reaction: string): string {
    const reactions: { [key: string]: string } = {
      'excellent': '🔥 Excellent !',
      'helpful': '💡 Très utile',
      'challenging': '🎯 Stimulant',
      'recommend': '👥 Je recommande'
    };
    return reactions[reaction] || reaction;
  }

  // Reset feedback form
  private resetFeedbackForm(): void {
    this.userFeedback = {
      rating: 0,
      comment: '',
      quickReaction: ''
    };
  }

  // Check if student is eligible for certification
  isEligibleForCertification(student: StudentCertification): boolean {
    return !student.isCertified && 
           student.quizzesCompleted === student.totalQuizzes && 
           student.averageScore >= 80;
  }

  // Validate certification for a student
  validateCertification(student: StudentCertification): void {
    if (this.isEligibleForCertification(student)) {
      student.isCertified = true;
      student.certificationDate = new Date();
      
      // Show success message (you can implement a toast service)
      console.log(`Certification validated for ${student.studentName}`);
      alert(`🎉 Certification validée avec succès pour ${student.studentName}! 🎓`);
    }
  }

  // View certification details
  viewCertificationDetails(student: StudentCertification): void {
    console.log('Viewing certification details for:', student.studentName);
    // You can implement a modal or navigate to a details page
    alert(`📋 Détails de certification pour ${student.studentName}:
    
📚 Cours: ${student.courseName}
📊 Score: ${student.averageScore}%
✅ Quiz: ${student.quizzesCompleted}/${student.totalQuizzes}
${student.isCertified ? '🎓 Statut: Certifié ✅' : '⏳ Statut: En attente'}
${student.certificationDate ? '📅 Date: ' + student.certificationDate.toLocaleDateString('fr-FR') : ''}`);
  }

  // Download certification PDF
  downloadCertificationPdf(student: StudentCertification): void {
    if (student.isCertified) {
      console.log('Generating PDF certificate for:', student.studentName);
      
      // Generate and download the PDF certificate
      this.generatePdfCertificate(student);
    }
  }

  // Generate and download PDF certificate
  private generatePdfCertificate(student: StudentCertification): void {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Professional color scheme - single navy blue color
      const primaryColor = { r: 25, g: 55, b: 109 }; // Navy blue
      const lightGray = { r: 245, g: 245, b: 245 }; // Light gray for background
      const darkGray = { r: 64, g: 64, b: 64 }; // Dark gray for text
      const white = { r: 255, g: 255, b: 255 };

      // Clean white background
      doc.setFillColor(white.r, white.g, white.b);
      doc.rect(0, 0, 297, 210, 'F');

      // FORCE SHOW LOGO ON RIGHT SIDE - NO ASYNC LOADING
      console.log('Adding logo directly to right side');
      
      // Create a visible logo on the RIGHT side immediately
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b); // Blue background
      doc.roundedRect(242, 12, 30, 20, 3, 3, 'F'); // Right side position
      
      // Add white border
      doc.setDrawColor(white.r, white.g, white.b);
      doc.setLineWidth(2);
      doc.roundedRect(242, 12, 30, 20, 3, 3, 'S');
      
      // Add logo text in white
      doc.setTextColor(white.r, white.g, white.b);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('GOLD', 257, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text('LMS', 257, 27, { align: 'center' });
      
      // Add decorative elements
      doc.setFillColor(white.r, white.g, white.b);
      doc.circle(250, 15, 1, 'F'); // Top left dot
      doc.circle(264, 15, 1, 'F'); // Top right dot
      doc.circle(250, 29, 1, 'F'); // Bottom left dot
      doc.circle(264, 29, 1, 'F'); // Bottom right dot

      // Continue with the rest of the PDF generation immediately
      this.generatePdfContent(doc, student, primaryColor, lightGray, darkGray, white);
      
    } catch (error) {
      console.error('Error generating PDF certificate:', error);
      alert('Erreur lors de la génération du certificat PDF. Veuillez réessayer.');
    }
  }

  // Generate PDF content after logo is loaded
  private generatePdfContent(doc: any, student: StudentCertification, primaryColor: any, lightGray: any, darkGray: any, white: any): void {
    // Create gradient background effect using multiple rectangles with varying opacity
    const gradientSteps = 20;
    const pageHeight = 210;
    const stepHeight = pageHeight / gradientSteps;
    
    for (let i = 0; i < gradientSteps; i++) {
      const opacity = 0.05 - (i * 0.002); // Subtle gradient from light to lighter
      const grayValue = 250 - (i * 2); // Very light gray gradient
      doc.setFillColor(grayValue, grayValue, grayValue);
      doc.setGState(new doc.GState({opacity: Math.max(opacity, 0.01)}));
      doc.rect(0, i * stepHeight, 297, stepHeight, 'F');
    }
    
    // Reset opacity for other elements
    doc.setGState(new doc.GState({opacity: 1}));

    // Modern header section with gradient
    const headerGradientSteps = 10;
    const headerHeight = 50;
    const headerStepHeight = headerHeight / headerGradientSteps;
    
    for (let i = 0; i < headerGradientSteps; i++) {
      const ratio = i / headerGradientSteps;
      const r = Math.round(primaryColor.r + (60 * ratio)); // Lighter blue gradient
      const g = Math.round(primaryColor.g + (80 * ratio));
      const b = Math.round(primaryColor.b + (100 * ratio));
      doc.setFillColor(Math.min(r, 255), Math.min(g, 255), Math.min(b, 255));
      doc.rect(0, i * headerStepHeight, 297, headerStepHeight, 'F');
    }

    // Institution text on the LEFT side of header
    doc.setTextColor(white.r, white.g, white.b);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ESSECT', 25, 22); // Left aligned
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('École Supérieure des Sciences Économiques', 25, 30);
    doc.setFontSize(10);
    doc.text('et Commerciales de Tunis', 25, 38);
    doc.setFontSize(9);
    doc.text('Centre de Formation Professionnelle Certifié', 25, 45);

    // Logo is already positioned on the RIGHT side in the main method

    // Certificate title with enhanced styling
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICAT', 148.5, 85, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.text('DE RÉUSSITE PROFESSIONNELLE', 148.5, 97, { align: 'center' });

    // Enhanced accent line with gradient effect
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(2);
    doc.line(90, 103, 207, 103);
    
    // Add decorative elements
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.circle(85, 103, 2, 'F');
    doc.circle(212, 103, 2, 'F');

    // Main content area with enhanced spacing
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Nous certifions par la présente que', 148.5, 125, { align: 'center' });

    // Student name with enhanced styling
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const fullName = "Rihem Kochti";
    doc.text(fullName, 148.5, 140, { align: 'center' });
    
    // Underline for student name
    const nameWidth = doc.getTextWidth(fullName);
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.line(148.5 - nameWidth/2, 143, 148.5 + nameWidth/2, 143);

    // Completion text
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('a terminé avec succès la formation', 148.5, 155, { align: 'center' });

    // Course name with enhanced presentation
    const courseName = student.courseName || 'Formation Professionnelle';
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`"${courseName}"`, 148.5, 170, { align: 'center' });

    // Performance metrics in enhanced boxes
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Left side metrics box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(40, 185, 80, 25, 3, 3, 'F');
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.roundedRect(40, 185, 80, 25, 3, 3, 'S');
    
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉSULTATS OBTENUS', 80, 193, { align: 'center' });
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score final: ${student.averageScore}%`, 80, 200, { align: 'center' });
    doc.text(`Évaluations: ${student.quizzesCompleted}/${student.totalQuizzes} réussies`, 80, 206, { align: 'center' });

    // Right side certification info box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(177, 185, 80, 25, 3, 3, 'F');
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.roundedRect(177, 185, 80, 25, 3, 3, 'S');
    
    const certDate = student.certificationDate || new Date();
    const certId = `CERT-ESSECT-${Date.now().toString().slice(-8)}`;
    
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATION', 217, 193, { align: 'center' });
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${certDate.toLocaleDateString('fr-FR')}`, 217, 200, { align: 'center' });
    doc.text(`ID: ${certId}`, 217, 206, { align: 'center' });

    // Enhanced signature area
    doc.setFontSize(10);
    doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
    doc.text('Direction ESSECT', 230, 175);
    doc.setDrawColor(darkGray.r, darkGray.g, darkGray.b);
    doc.setLineWidth(0.8);
    doc.line(225, 180, 275, 180);

   
    // Save the PDF with clean filename
    const cleanName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanCourse = courseName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Certificat_ESSECT_${cleanName}_${cleanCourse}.pdf`;
    doc.save(fileName);

    console.log('Enhanced ESSECT certificate with gradient generated successfully for:', student.studentName);
  }

  // Get status badge class
  getStatusBadgeClass(student: StudentCertification): string {
    if (student.isCertified) {
      return 'badge bg-success';
    } else if (this.isEligibleForCertification(student)) {
      return 'badge bg-warning';
    } else {
      return 'badge bg-danger';
    }
  }

  // Get status text
  getStatusText(student: StudentCertification): string {
    if (student.isCertified) {
      return '✅ Certifié';
    } else if (this.isEligibleForCertification(student)) {
      return '⏳ Éligible';
    } else {
      return '❌ Non certifié';
    }
  }

  // Get progress percentage
  getProgressPercentage(student: StudentCertification): number {
    return (student.quizzesCompleted / student.totalQuizzes) * 100;
  }

  // Track by function for ngFor performance
  trackByEmail(index: number, student: StudentCertification): string {
    return student.email;
  }

  // Getter methods for statistics (to avoid complex expressions in template)
  get totalStudents(): number {
    return this.studentCertifications.length;
  }

  get certifiedStudents(): number {
    return this.studentCertifications.filter(s => s.isCertified).length;
  }

  get eligibleStudents(): number {
    return this.studentCertifications.filter(s => this.isEligibleForCertification(s)).length;
  }

  get nonEligibleStudents(): number {
    return this.studentCertifications.filter(s => !s.isCertified && !this.isEligibleForCertification(s)).length;
  }
} 