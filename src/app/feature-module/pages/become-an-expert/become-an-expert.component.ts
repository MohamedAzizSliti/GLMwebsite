import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import {AccessDataService} from "../../../services/access-data.service";
import {NotificationService} from "../../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-become-an-expert',
  standalone: false,

  templateUrl: './become-an-expert.component.html',
  styleUrl: './become-an-expert.component.scss'
})
export class BecomeAnExpertComponent {
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
                private notificationService:NotificationService) {
    }

  signup(){

    this.accessDataService.postData(this.user,'register').subscribe(
          (response: any) => {
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
