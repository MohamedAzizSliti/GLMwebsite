import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared-module';
import { MatSliderModule } from '@angular/material/slider';
import {CourseGridComponent} from "./course-grid.component";
import {CourseGridRoutingModule} from "./course-grid-routing.module";


@NgModule({
  declarations: [
    CourseGridComponent
  ],
  imports: [
    CommonModule,
    CourseGridRoutingModule,
    SharedModule,
    MatSliderModule
  ]
})
export class CourseGridModule { }
