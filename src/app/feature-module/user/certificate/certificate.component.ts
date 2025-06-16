import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate?: string;
  certificationDate?: string;
  score: string;
  evaluation: string;
  certificateId?: string;
  organizationName?: string;
  organizationLogo?: string;
}

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  @Input() certificateData: CertificateData = {
    studentName: 'Rihem kochti',
    courseName: 'Html, CSS',
    completionDate: '15/03/2025',
    score: '92%',
    evaluation: '3/3 Réussi',
    certificateId: 'CERT-ESSECT-23999560',
    organizationName: 'GOLD LMS',
    organizationLogo: 'assets/img/certificate-logo.svg'
  };

  @Input() showPrintButton: boolean = true;
  @Input() showDownloadButton: boolean = true;

  private verificationCode: string = '';
  private certificateId: string = '';

  constructor() { }

  ngOnInit(): void {
    this.verificationCode = this.generateVerificationCode();
    this.certificateId = this.generateCertificateId();
  }

  printCertificate(): void {
    window.print();
  }

  downloadCertificate(): void {
    // Convert to PDF and download
    const element = document.getElementById('certificate-content');
    if (element) {
      // You can use html2canvas + jsPDF here for PDF generation
      // For now, we'll trigger print
      this.printCertificate();
    }
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR');
  }

  generateVerificationCode(): string {
    if (this.verificationCode) {
      return this.verificationCode;
    }
    
    // Generate a unique verification code
    const prefix = 'VER';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.verificationCode = `${prefix}-${timestamp}-${random}`;
    
    return this.verificationCode;
  }

  generateCertificateId(): string {
    if (this.certificateId) {
      return this.certificateId;
    }
    
    // Generate a unique certificate ID
    const prefix = 'CERT-ESSECT';
    const timestamp = Date.now().toString().slice(-8);
    this.certificateId = `${prefix}-${timestamp}`;
    
    return this.certificateId;
  }

  // Get current academic year
  getCurrentAcademicYear(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear} - ${currentYear + 1}`;
  }
}
