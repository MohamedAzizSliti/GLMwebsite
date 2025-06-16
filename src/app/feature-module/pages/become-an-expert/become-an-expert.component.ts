import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import {AccessDataService} from "../../../services/access-data.service";
import {NotificationService} from "../../../services/notification.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../../services/global.service";
import {TranslationService} from "../../../services/translation.service";

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
    password_confirmation:null,status:0,role:'teacher'};
  termsAccepted: boolean = false;
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
                private notificationService:NotificationService,
                private globalService: GlobalService,
                private translationService: TranslationService) {
    }

  signup(){
    // Basic validation
    if (!this.user.name || !this.user.email || !this.user.phone || !this.user.password || !this.user.password_confirmation) {
      this.notificationService.showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.user.password !== this.user.password_confirmation) {
      this.notificationService.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (this.user.password.length < 8) {
      this.notificationService.showError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (!this.termsAccepted) {
      this.notificationService.showError('Veuillez accepter les conditions générales d\'utilisation.');
      return;
    }

    // Ensure role is set to teacher
    this.user.role = 'teacher';

    this.accessDataService.postData(this.user,'register').subscribe(
          (response: any) => {
            if (response.success) {
              this.notificationService.showSuccess('Félicitations! Votre compte professeur a été créé avec succès. Vous pouvez maintenant créer et gérer vos cours.');
              // Store user data with access token using the new service
              const userData = {
                ...response.user,
                access_token: response.access_token
              };
              this.globalService.setCurrentUser(userData);
              this.router.navigate(['/user/dashboard']); // Navigate to teacher dashboard
            }
          },
          error => {
            console.error('Registration error:', error);
            const errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            this.notificationService.showError(errorMessage);
          },
          () => {
          }
        )
  }
}
