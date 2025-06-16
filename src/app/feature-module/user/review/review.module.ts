import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { SharedModule } from '../../../shared/shared-module';

// Import management components
import { ChapterManagementComponent } from '../course-management/chapter-management/chapter-management.component';
import { QuizManagementComponent } from '../course-management/quiz-management/quiz-management.component';
import { ExamManagementComponent } from '../course-management/exam-management/exam-management.component';
import { CourseSettingsComponent } from '../course-management/course-settings/course-settings.component';


@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    SharedModule,
    // Management components (standalone)
    ChapterManagementComponent,
    QuizManagementComponent,
    ExamManagementComponent,
    CourseSettingsComponent
  ]
})
export class ReviewModule { }
