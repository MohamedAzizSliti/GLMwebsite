import { Component, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import {GlobalService} from "../../../services/global.service";
import {AccessDataService} from "../../../services/access-data.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";

declare var bootstrap: any; // Needed to use Bootstrap modal manually

export class UserModel {
  id:number = 0;
  name:string = '';
  phone:string = '';
  email:string = '';
  adress:string = '';
}

@Component({
  selector: 'app-hotel-booking',
  standalone: false,
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent {
  public routes = routes;
  public purchasedCourse: any = null;
  password: boolean[] = [false, false];
  now: any = null;
  user: UserModel = new UserModel();
  currentUser: any = null;
  isProcessing: boolean = false;
  enrollment: any;
  orderNumber: any = null;

  constructor(
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private accesseDataService: AccessDataService
  ) {
    if (this.globalService.getCurrentUser()) {
      this.user = this.globalService.getCurrentUser();
    }
    const raw = localStorage.getItem('purchased_course');
    this.purchasedCourse = raw ? JSON.parse(raw) : null;
    this.now = new Date();
  }

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }

  @ViewChild('fileInput') fileInput: any;

  openFileExplorer(): void {
    this.fileInput.nativeElement.click();
  }

  confirmAndPay() {
    if (!this.purchasedCourse || !this.user.email || !this.user.name) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isProcessing = true;
    this.processEnrollment();
  }

  private processEnrollment() {
    this.enrollment = {};
    this.enrollment['course_id'] = this.purchasedCourse.id;
    this.enrollment['user_id'] = this.user.id;
    this.enrollment['created_at'] = new Date();
    this.enrollment['progress'] = 0;
    this.enrollment['course_price'] = this.purchasedCourse.regular_price || this.purchasedCourse.price || 0;
    this.enrollment['status'] = 'active';
    this.enrollment['enrolled_at'] = new Date();

    console.log('🔄 Creating enrollment:', this.enrollment);

    this.spinner.show();
    this.accesseDataService.postData(this.enrollment, 'save-enrollment').subscribe({
      next: (response: any) => {
        console.log('✅ Enrollment created successfully:', response);
        this.spinner.hide();
        this.isProcessing = false;
        this.orderNumber = response.identifier || `ENR-${Date.now()}`;
        
        // Clear purchased course from localStorage
        localStorage.removeItem('purchased_course');
        
        // Show success modal
        const modalElement = document.getElementById('booking-success');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Redirect to course details after a delay
        setTimeout(() => {
          this.router.navigate(['/course/course-details', this.purchasedCourse.id]);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Enrollment creation error:', error);
        this.spinner.hide();
        this.isProcessing = false;
        alert('Erreur lors de l\'inscription au cours. Veuillez réessayer.');
      }
    });
  }
}
