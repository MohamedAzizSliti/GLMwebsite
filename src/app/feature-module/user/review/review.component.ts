import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import {AccessDataService} from "../../../services/access-data.service";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalService} from "../../../services/global.service";

@Component({
  selector: 'app-review',
  standalone: false,

  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
routes=routes;
courses:any = [];
constructor(private accessDataService:AccessDataService,private ngxSpinner : NgxSpinnerService,private globaleService:GlobalService) {
  this.ngxSpinner.show()
  this.accessDataService.getData(null,'current-courses/'+this.globaleService.getCurrentUser().id).subscribe(
    (response: any) => {
      this.courses = response;
    },
    error => {
      this.ngxSpinner.hide()
    },
    () => {
      this.ngxSpinner.hide()
    });
}
}
