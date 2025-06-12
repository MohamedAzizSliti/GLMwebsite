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
  public routes =routes;
  public purchasedCourse : any = null
 isPayment=true;
 isPayment1=false;
 isPayment2=false;
 password: boolean[] = [false, false]; // Add more as needed
 now:any = null;
  user:  UserModel = new UserModel();
  currentUser : any = null
  isProcessing:boolean = false;
  enrollment:any;
  orderNumber : any = null;
  constructor(private globalService:GlobalService,
              private spinner:NgxSpinnerService,
              private router:Router,
              private accesseDataService:AccessDataService) {
    if (this.globalService.getCurrentUser() )
    this.user = this.globalService.getCurrentUser()   ;
    const raw = localStorage.getItem('purchased_course');
    this.purchasedCourse = raw ? JSON.parse(raw) : null;
    this.now = new Date();
  }
 togglePassword(index: number): void {
   this.password[index] = !this.password[index];
 }
 onPayment() : void{
  this.isPayment1=false;
  this.isPayment=true;
  this.isPayment2=false;
 }
 onPayment1() : void{
  this.isPayment=false;
  this.isPayment1=true;
  this.isPayment2=false;
 }
 onPayment2() : void{
  this.isPayment2=true;
  this.isPayment=false;
  this.isPayment1=false;
 }
 @ViewChild('fileInput') fileInput: any;

  openFileExplorer(): void {
    this.fileInput.nativeElement.click();
  }


  confirmAndPay() {
    this.isProcessing = true;
    this.enrollment = {};
    this.enrollment['course_id'] = this.purchasedCourse.id;
    this.enrollment['user_id'] = this.user.id;
    this.enrollment['created_at'] =  new Date();
    this.enrollment['course_price'] =  new Date();
    this.enrollment['progress'] =  0;
    this.enrollment['course_price'] =   this.purchasedCourse.regular_price;

    this.spinner.show();
    this.accesseDataService.postData(this.enrollment,'save-enrollment').subscribe(
          (response: any) => {
            this.spinner.hide();
            this.isProcessing = false
            const modalElement = document.getElementById('booking-success');
            const modal = new bootstrap.Modal(modalElement);
            this.orderNumber = response.identifier;
            modal.show();
            this.router.navigate([routes.home])
          },
          error => {
            this.spinner.hide();
            this.isProcessing = false
          },
          () => {
          }
        )

    // Show the confirmation modal


  }
}
