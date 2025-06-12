import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizModalComponent } from './components/quiz-modal/quiz-modal.component';
import {QuizResultComponent} from "./components/quiz-result/quiz-result.component";

@NgModule({
  declarations: [
    ],

  imports: [
    QuizResultComponent,
    CommonModule,
    QuizModalComponent
  ],
  exports: [
    QuizModalComponent
  ]
})
export class QuizModalModule { }
