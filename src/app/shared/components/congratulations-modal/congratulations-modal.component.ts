import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessDataService } from '../../../services/access-data.service';

// Import jsPDF properly
declare var require: any;

export interface CongratulationsData {
  enrollment_id: number;
  course: {
    id: number;
    title: string;
    description?: string;
  };
  average_score: number;
  quizzes_completed: number;
  total_quizzes: number;
  certification_date: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

@Component({
  selector: 'app-congratulations-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './congratulations-modal.component.html',
  styleUrls: ['./congratulations-modal.component.scss']
})
export class CongratulationsModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() congratulationsData: CongratulationsData | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() feedbackSubmitted = new EventEmitter<void>();

  // Feedback form data
  rating = 0;
  selectedReaction = '';
  feedbackText = '';
  showFeedbackSection = false;
  isSubmittingFeedback = false;

  // Reactions
  reactions = [
    { id: 'excellent', label: 'Excellent!', icon: '🌟' },
    { id: 'useful', label: 'Très utile', icon: '💡' },
    { id: 'engaging', label: 'Stimulant', icon: '🚀' },
    { id: 'recommend', label: 'Je recommande', icon: '👍' }
  ];

  constructor(private accessDataService: AccessDataService) {}

  ngOnInit(): void {
    if (this.isVisible) {
      // Show feedback section after 3 seconds
      setTimeout(() => {
        this.showFeedbackSection = true;
      }, 3000);
    }
  }

  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
    
    // Mark congratulations as shown
    if (this.congratulationsData) {
      this.markCongratulationsShown();
    }
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  selectReaction(reactionId: string): void {
    this.selectedReaction = this.selectedReaction === reactionId ? '' : reactionId;
  }

  submitFeedback(): void {
    if (!this.congratulationsData || this.rating === 0) {
      return;
    }

    this.isSubmittingFeedback = true;

    const feedbackData = {
      enrollment_id: this.congratulationsData.enrollment_id,
      rating: this.rating,
      reaction: this.selectedReaction,
      feedback_text: this.feedbackText.trim()
    };

    this.accessDataService.postData(feedbackData, 'submit-course-feedback').subscribe({
      next: (response: any) => {
        if (response && (response as ApiResponse).success) {
          this.feedbackSubmitted.emit();
          this.closeModal();
        } else {
          alert('Erreur lors de l\'envoi du feedback. Veuillez réessayer.');
        }
        this.isSubmittingFeedback = false;
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        alert('Erreur lors de l\'envoi du feedback. Veuillez réessayer.');
        this.isSubmittingFeedback = false;
      }
    });
  }

  private markCongratulationsShown(): void {
    if (!this.congratulationsData) return;

    const data = {
      enrollment_id: this.congratulationsData.enrollment_id
    };

    this.accessDataService.postData(data, 'mark-congratulations-shown').subscribe({
      next: (response: any) => {
        // Silently mark as shown
        console.log('Congratulations marked as shown');
      },
      error: (error) => {
        console.error('Error marking congratulations as shown:', error);
      }
    });
  }

  downloadCertificate(): void {
    if (!this.congratulationsData) return;

    try {
      const { jsPDF } = require('jspdf');
      const doc = new jsPDF('landscape', 'mm', 'a4'); // Landscape orientation for professional look
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Colors
      const goldColor = [218, 165, 32]; // Gold color
      const darkColor = [51, 51, 51]; // Dark text
      const lightGoldColor = [255, 215, 0]; // Light gold
      
      // Background and borders
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Golden border frame
      doc.setDrawColor(...goldColor);
      doc.setLineWidth(3);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      
      // Inner decorative border
      doc.setLineWidth(1);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
      
      // Decorative corner elements (simplified)
      doc.setFillColor(...goldColor);
      // Top left corner decoration
      doc.triangle(20, 20, 40, 20, 20, 40, 'F');
      // Top right corner decoration
      doc.triangle(pageWidth - 20, 20, pageWidth - 40, 20, pageWidth - 20, 40, 'F');
      // Bottom left corner decoration
      doc.triangle(20, pageHeight - 20, 40, pageHeight - 20, 20, pageHeight - 40, 'F');
      // Bottom right corner decoration
      doc.triangle(pageWidth - 20, pageHeight - 20, pageWidth - 40, pageHeight - 20, pageWidth - 20, pageHeight - 40, 'F');
      
      // Gold LMS Logo area (text-based)
      doc.setTextColor(...goldColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('GOLD LMS', 30, 35);
      
      // Direction ESSECT (top right)
      doc.setTextColor(...darkColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('DIRECTION ESSECT', pageWidth - 80, 35);
      
      // Main title
      doc.setTextColor(...darkColor);
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICAT', pageWidth / 2, 60, { align: 'center' });
      
      doc.setFontSize(24);
      doc.setTextColor(...goldColor);
      doc.text('DE RÉUSSITE', pageWidth / 2, 75, { align: 'center' });
      
      // Certification text
      doc.setTextColor(...goldColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('NOUS CERTIFIONS QUE:', pageWidth / 2, 95, { align: 'center' });
      
      // Student name (elegant script-like)
      const userName = JSON.parse(localStorage.getItem('user') || '{}').name || 'Étudiant';
      doc.setTextColor(...darkColor);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bolditalic');
      doc.text(userName, pageWidth / 2, 115, { align: 'center' });
      
      // Decorative line under name
      doc.setDrawColor(...goldColor);
      doc.setLineWidth(1);
      const nameWidth = doc.getTextWidth(userName);
      doc.line((pageWidth - nameWidth) / 2, 120, (pageWidth + nameWidth) / 2, 120);
      
      // Course completion text
      doc.setTextColor(...goldColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`A terminé avec succès la formation "${this.congratulationsData.course.title}".`, pageWidth / 2, 135, { align: 'center' });
      
      // Motivational text
      doc.setTextColor(...darkColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text('Cet accomplissement n\'est que le premier pas vers un avenir encore plus', pageWidth / 2, 150, { align: 'center' });
      doc.text('prometteur.', pageWidth / 2, 160, { align: 'center' });
      
      // Results section
      doc.setTextColor(...goldColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('résultats obtenus:', 60, 180);
      
      doc.setTextColor(...darkColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`score final: ${this.congratulationsData.average_score}%`, 60, 190);
      doc.text(`Évaluation: ${this.congratulationsData.quizzes_completed}/${this.congratulationsData.total_quizzes} Réussi`, 60, 200);
      
      // Certification section
      doc.setTextColor(...goldColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('certification:', pageWidth - 120, 180);
      
      const certDate = new Date(this.congratulationsData.certification_date).toLocaleDateString('fr-FR');
      doc.setTextColor(...darkColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`date: ${certDate}`, pageWidth - 120, 190);
      
      // Generate certificate ID
      const certId = `CERT-ESSECT-${Date.now().toString().slice(-8)}`;
      doc.text(`id: ${certId}`, pageWidth - 120, 200);
      
      // Golden seal/badge area (simplified circle)
      doc.setFillColor(...lightGoldColor);
      doc.circle(pageWidth / 2, 185, 15, 'F');
      doc.setDrawColor(...goldColor);
      doc.setLineWidth(2);
      doc.circle(pageWidth / 2, 185, 15);
      doc.circle(pageWidth / 2, 185, 12);
      
      // Seal text
      doc.setTextColor(...darkColor);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('GOLD', pageWidth / 2, 182, { align: 'center' });
      doc.text('LMS', pageWidth / 2, 188, { align: 'center' });
      
      // Save the PDF
      const fileName = `Certificat-${userName.replace(/\s+/g, '-')}-${this.congratulationsData.course.title.replace(/\s+/g, '-')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Erreur lors de la génération du certificat. Veuillez réessayer.');
    }
  }

  getScoreColor(): string {
    if (!this.congratulationsData) return 'text-primary';
    
    const score = this.congratulationsData.average_score;
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-info';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  }

  getScoreLabel(): string {
    if (!this.congratulationsData) return '';
    
    const score = this.congratulationsData.average_score;
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très bien';
    if (score >= 70) return 'Bien';
    return 'Satisfaisant';
  }

  getCompletionPercentage(): number {
    if (!this.congratulationsData) return 0;
    return Math.round((this.congratulationsData.quizzes_completed / this.congratulationsData.total_quizzes) * 100);
  }
} 