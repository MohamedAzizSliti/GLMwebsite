import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateComponent, CertificateData } from '../certificate/certificate.component';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-certificate-page',
  standalone: true,
  imports: [CommonModule, CertificateComponent],
  templateUrl: './certificate-page.component.html',
  styleUrls: ['./certificate-page.component.scss']
})
export class CertificatePageComponent implements OnInit {
  certificateData: CertificateData | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.loadCertificateData();
  }

  loadCertificateData(): void {
    // Get certificate data from query parameters
    const queryParams = this.route.snapshot.queryParams;

    if (queryParams['studentName'] && queryParams['courseName']) {
      // Load certificate data from query parameters
      this.loadCertificateFromParams(queryParams);
    } else {
      // Load default certificate for current user
      this.loadUserCertificate();
    }
  }

  loadCertificateFromParams(queryParams: any): void {
    // Load certificate data from query parameters
    setTimeout(() => {
      this.certificateData = {
        studentName: queryParams['studentName'] || 'Étudiant Certifié',
        courseName: queryParams['courseName'] || 'Formation Complète',
        completionDate: queryParams['certificationDate'] || new Date().toLocaleDateString('fr-FR'),
        score: queryParams['score'] || '95%',
        evaluation: queryParams['evaluation'] || '3/3 Réussi',
        certificateId: queryParams['certificateId'] || 'CERT-ESSECT-' + Math.floor(Math.random() * 100000000),
        organizationName: 'GOLD LMS'
      };
      this.loading = false;
    }, 1000);
  }

  loadUserCertificate(): void {
    const user = this.globalService.getCurrentUser();
    
    // Simulate loading user's certificate
    setTimeout(() => {
      this.certificateData = {
        studentName: user?.name || 'Utilisateur Certifié',
        courseName: 'Formation Complète Gold LMS',
        completionDate: new Date().toLocaleDateString('fr-FR'),
        score: '95%',
        evaluation: '3/3 Réussi',
        certificateId: 'CERT-ESSECT-' + Math.floor(Math.random() * 100000000),
        organizationName: 'GOLD LMS'
      };
      this.loading = false;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/user/my-enrollments']);
  }
}
