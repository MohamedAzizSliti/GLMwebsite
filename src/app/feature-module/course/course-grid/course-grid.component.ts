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

// Get course image URL with fallbacks
getCourseImageUrl(course: any): string {
  // First try media_path.original_url (from mediaPath accessor)
  if (course.media_path && course.media_path.original_url) {
    return course.media_path.original_url;
  }
  
  // Then try cover_image.url (from coverImage accessor)
  if (course.cover_image && course.cover_image.url) {
    return course.cover_image.url;
  }
  
  // Fallback to a default course image
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center';
}

// Handle image loading errors
onImageError(event: any): void {
  // Set a fallback image when the original fails to load
  event.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center';
}
}
