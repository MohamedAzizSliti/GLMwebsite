import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import {AccessDataService} from "../../../services/access-data.service";
import {NotificationService} from "../../../services/notification.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-become-an-student',
  standalone: false,

  templateUrl: './become-an-student.component.html',
  styleUrl: './become-an-student.component.scss'
})
export class BecomeAnStudentComponent {
routes = routes
  password: boolean[] = [false, false]; // Add more as needed

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }
  user : any = {name:null,email:null,phone:null,
    country_code:'+216',
    password:null,
    password_confirmation:null,status:0};
private lightGallery!: LightGallery;
settings = {
        counter: false,
        plugins: [lgZoom, lgVideo],
      };

    onInit = (detail: { instance: LightGallery }): void => {
      this.lightGallery = detail.instance;
    };

    constructor(private accessDataService : AccessDataService,
                private router: Router,
                private spinner:NgxSpinnerService,
                private notificationService:NotificationService) {
    }

  signup(){
    this.spinner.show();
    this.accessDataService.postData(this.user,'register').subscribe(
          (response: any) => {
            this.spinner.hide();
             this.notificationService.showSuccess('Votre compte a été créé avec succès');
             localStorage.setItem('user',response.user);
             this.router.navigate([routes.home])
          },
          error => {
            this.notificationService.showError(error.error.message);
          },
          () => {
          }
        )
  }
}
