import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import {QuizModalModule} from "../../quiz-modal-component/quiz-modal.module";
import {CourseDetailsComponent} from "./course-details.component";
import {CourseDetailsRoutingModule} from "./course-details-routing.module";


@NgModule({
  declarations: [
    CourseDetailsComponent
  ],
  imports: [
    CommonModule,
    CourseDetailsRoutingModule,
    SharedModule,
    QuizModalModule
  ]
})
export class CourseDetailsModule { }
