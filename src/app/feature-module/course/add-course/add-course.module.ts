import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import {AddCourseComponent} from "./add-course.component";
import {AddCourseRoutingModule} from "./add-course-routing.module";


@NgModule({
  declarations: [
    AddCourseComponent
  ],
  imports: [
    CommonModule,
    AddCourseRoutingModule,
    SharedModule
  ]
})
export class AddCourseModule { }
