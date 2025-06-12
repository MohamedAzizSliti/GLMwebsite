import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CourseComponent} from "./course.component";

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    children: [
      {
        path: 'hotel-map',
        loadChildren: () =>
          import('./hotel-map/hotel-map.module').then((m) => m.HotelMapModule),
      },
      {
        path: 'hotel-list',
        loadChildren: () =>
          import('./hotel-list/hotel-list.module').then(
            (m) => m.HotelListModule
          ),
      },
      {
        path: 'hotel-grid',
        loadChildren: () =>
          import('./course-grid/course-grid.module').then(
            (m) => m.CourseGridModule
          ),
      },
      {
        path: 'course-details/:id',
        loadChildren: () =>
          import('./course-details/course-details.module').then(
            (m) => m.CourseDetailsModule
          ),
      },
      {
        path: 'course-purchase',
        loadChildren: () =>
          import('./hotel-booking/hotel-booking.module').then(
            (m) => m.HotelBookingModule
          ),
      },
      {
        path: 'add-hotel',
        loadChildren: () =>
          import('./add-course/add-course.module').then((m) => m.AddCourseModule),
      },
     ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
