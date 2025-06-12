import { Component, Input } from '@angular/core';
import { QuizResult } from '../../models/exam.model';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  standalone:true,
  imports : [
    CommonModule
  ],
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent {
  @Input() result: QuizResult | null = null;

  /**
   * Calcule le pourcentage de réussite
   */
  get successPercentage(): number {
    if (!this.result) return 0;
    return Math.round((this.result.correctAnswers / this.result.totalQuestions) * 100);
  }

  /**
   * Détermine la classe CSS à appliquer en fonction du résultat
   */
  get resultClass(): string {
    if (!this.result) return '';
    return this.result.passed ? 'success' : 'failure';
  }
}
