import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from '../../../shared/routes/routes';
import {AccessDataService} from "../../../services/access-data.service";
import {GlobalService} from "../../../services/global.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-course-grid',
  standalone: false,

  templateUrl: './course-grid.component.html',
  styleUrl: './course-grid.component.scss'
})
export class CourseGridComponent {
public routes=routes;
 bsValue =new Date();
 value!: number;
 public isClassAdded: boolean[] = [false];
 public isSelected :boolean[]=[false];
 rangeValues: number[] = [20, 80];
 public isMore : boolean[]=[false];
 startValue = 500;
  endValue = 3000;
  courses : any[] = [];
  currentUser : any = null
 constructor (private router: Router,
              private spinner : NgxSpinnerService,
              private globalService : GlobalService,
              private accessDataService : AccessDataService
 ){
    this.spinner.show();
   this.accessDataService.getData(null,'course').subscribe(
         (response: any) => {
              this.courses = response.data;
              this.spinner.hide();
         },
         error => {
         },
         () => {
         }
       )

  this.currentUser =  this.globalService.getCurrentUser();
 }

 formatLabel(value: number): string {
  if (value >= 100) {
    return Math.round(value) + '';
  }

  return `${value}`;
}
formatLabel1(value: number): string {
  if (value >= 5000) {
    return '$'+ Math.round(value / 5000) ;
  }

  return `$${value}`;
}
 public imageSlider : OwlOptions ={
  loop: true,
    margin: 20,
    nav: true,
    dots: true,
    smartSpeed: 2000,
    autoplay: false,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      550: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
}
toggleClass(index: number){
  this.isClassAdded[index] = !this.isClassAdded[index]
}
selectClass(index:number):void{
 this.isSelected[index]=!this.isSelected[index];
}
showMore(index:number) : void {
  this.isMore[index]=!this.isMore[index];
}
}
