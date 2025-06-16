import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import { LightGallery } from 'lightgallery/lightgallery';
import { Router } from '@angular/router';
import { routes } from '../../shared/routes/routes';
import {AccessDataService} from "../../services/access-data.service";
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  public routes=routes;
  time: Date | null = null; // Bind this to the p-calendar
  categories : any[] = []
  courses : any[] = []
  
  // Pre-generated random numbers to avoid ExpressionChangedAfterItHasBeenCheckedError
  public randomTeachers: number = 0;
  public randomStudents: number = 0;
  
  constructor(private router: Router,private accessDataService:AccessDataService) {
    // Generate random numbers once during initialization
    this.randomTeachers = this.getRandomNumber(1, 5);
    this.randomStudents = this.getRandomNumber(10, 100);
    
    this.accessDataService.getData(null,'category').subscribe(
          (response: any) => {
            this.categories = response.data;
          },
          error => {
          },
          () => {
          }
        )

    this.accessDataService.getData(null,'course').subscribe(
      (response: any) => {
        this.courses = response.data;
      },
      error => {
      },
      () => {
      }
    )
  }
  isTabed=false;
  isTabed1=true;
  isTabed2=false;
  isTabed3=false;
  isTabed4=false;
  bsValue=new Date();
  isChecked=false;
  isChecked2=false;
  isChecked3=false;
  isChecked4=false;
  isChecked5=false;
  isChecked6=false;
  toreset=true;
  public isClassAdded: boolean[] = [false];
  public isSelected :boolean[]=[false];
  public placeSlider!:OwlOptions
  public imageSlider!:OwlOptions
  public bannerSlider: OwlOptions = {
    loop: true,
      margin: 0,
      nav: false,
      dots: true,
      autoplay: false,
      smartSpeed: 2000,
      autoWidth:true,
      animateOut: "custom-slide-out-up",
      animateIn: "custom-slide-in-up",

      responsive: {
        0: {
          items: 1,
        },

        550: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1400: {
          items: 1,
        },
      },
  };
  public destinationSlider: OwlOptions = {
    loop: true,
      margin: 24,
      nav: true,
      dots: false,
      autoplay: false,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 4,
        },
      },
  }
  public expertSlider :OwlOptions ={
      loop: true,
      margin: 24,
      nav: true,
      dots: false,
      autoplay: false,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
  }
  public clientSlider : OwlOptions ={
    loop: true,
      margin: 24,
      nav: false,
      dots: false,
      autoplay: true,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 2,
        },
        576: {
          items: 3,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 5,
        },
        1400: {
          items: 7,
        },
      },
  }
  settings = {
    counter: false,
    plugins: [lgZoom, lgVideo],
  };
  private lightGallery!: LightGallery;
  private needRefresh = false;
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
  onInit = (detail: { instance: LightGallery }): void => {
    this.lightGallery = detail.instance;

  };
  onSubmit() :void {
    this.router.navigateByUrl('/hotel/hotel-grid');
  }
  onSubmit2() :void {
   this.router.navigateByUrl('/flight/flight-grid');
  }
  onSubmit3() :void {
  this.router.navigateByUrl('/car/car-grid');
  }
  onSubmit4() :void {
  this.router.navigateByUrl('/cruise/cruise-grid');
  }
  onSubmit5() :void {
  this.router.navigateByUrl('/tour/tour-grid');
  }
  onCheck() :void{
    this.isChecked2=false;
    this.isChecked3=false;
  }
  onCheck2() :void{
    this.isChecked2=true;
    this.isChecked3=false;
  }
  onCheck3() :void{
    this.isChecked3=true;
    this.isChecked2=false;
  }
  onCheck4() :void{
    this.isChecked4=true;
    this.isChecked5=false;
    this.isChecked6=false;
  }
  onCheck5() :void{
    this.isChecked5=true;
    this.isChecked6=false;
    this.isChecked4=false ;
    this.toreset=false;
  }
  onCheck6() :void{
    this.isChecked4=false;
    this.isChecked6=true;
    this.isChecked5=false;
    this.toreset=false;
  }
  reset() :void{
    this.isChecked4=false;
    this.isChecked5=false;
    this.isChecked6=false;
    this.toreset=true;
  }
  ngOnInit(): void {
    // Set the default time to 10:30 AM
    const defaultTime = new Date();
    defaultTime.setHours(10, 30, 0, 0); // Set hours, minutes, seconds, milliseconds
    this.time = defaultTime;
    this.placeSlider ={
      loop: false,
        margin: 24,
        nav: true,
        dots: false,
        smartSpeed: 2000,
        autoplay: false,
        navText: [
          "<i class='isax isax-arrow-left-2'></i>",
          "<i class='isax isax-arrow-right-3'></i>",
        ],
        responsive: {
          0: {
            items: 1,
          },
          550: {
            items: 1,
          },
          768: {
            items: 2,
          },
          992: {
            items: 3,
          },
          1200: {
            items: 4,
          },
        },
    }
     this.imageSlider ={
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
  }
 openTab():void{
  this.isTabed = true;
  this.isTabed2=false;
 }
 openTab1():void{
  this.isTabed1 = true;
 }
 openTab2():void{
  this.isTabed2 = true;
 }
 openTab3():void{
  this.isTabed3 = true;
 }
 openTab4():void{
  this.isTabed4 = true;
 }
 toggleClass(index: number){
  this.isClassAdded[index] = !this.isClassAdded[index]
}
selectClass(index:number):void{
  this.isSelected[index] = !this.isSelected[index];
}

// Helper method to get category icon based on name or index
getCategoryIcon(categoryName: string, index: number): string {
  const icons = [
    'isax-code-1',           // Programming/Development
    'isax-brush-2',          // Design/Creative
    'isax-chart-2',          // Business/Marketing
    'isax-book-1',           // Education/Academic
    'isax-health',           // Health/Fitness
    'isax-music',            // Music/Arts
    'isax-camera',           // Photography/Media
    'isax-global',           // Languages/Communication
    'isax-cpu-charge',       // Technology/IT
    'isax-medal-star'        // Certification/Professional
  ];

  // Try to match category name to appropriate icon
  const name = categoryName.toLowerCase();
  if (name.includes('program') || name.includes('code') || name.includes('dev')) {
    return 'isax-code-1';
  } else if (name.includes('design') || name.includes('art') || name.includes('créat')) {
    return 'isax-brush-2';
  } else if (name.includes('business') || name.includes('marketing') || name.includes('commerce')) {
    return 'isax-chart-2';
  } else if (name.includes('langue') || name.includes('language') || name.includes('communication')) {
    return 'isax-global';
  } else if (name.includes('santé') || name.includes('health') || name.includes('fitness')) {
    return 'isax-health';
  } else if (name.includes('music') || name.includes('musique')) {
    return 'isax-music';
  } else if (name.includes('photo') || name.includes('media') || name.includes('vidéo')) {
    return 'isax-camera';
  } else if (name.includes('tech') || name.includes('informatique') || name.includes('it')) {
    return 'isax-cpu-charge';
  } else {
    // Fallback to index-based icon
    return icons[index % icons.length];
  }
}

// Helper method to generate random numbers for stats
getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
