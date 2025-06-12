import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Question } from '../../models/exam.model';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {
  @Input() question: Question | null = null;
  @Input() questionIndex: number = 0;
  @Input() totalQuestions: number = 0;

  selectedOptions: string[] = [];

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.loadSelectedOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recharger les options sélectionnées à chaque changement de question
    if (changes['question'] && !changes['question'].firstChange) {
      this.loadSelectedOptions();
    }
  }

  /**
   * Charge les options sélectionnées pour la question courante
   */
  loadSelectedOptions(): void {
    if (this.question) {
      const userAnswers = this.quizService.getUserAnswers();
      const existingAnswer = userAnswers.find(a => a.questionId === this.question?.id);

      // Réinitialiser le tableau local pour éviter les interférences entre questions
      this.selectedOptions = existingAnswer ? [...existingAnswer.selectedOptions] : [];
    } else {
      this.selectedOptions = [];
    }
  }

  /**
   * Gère la sélection d'une option pour les questions à choix unique
   * @param optionKey Clé de l'option sélectionnée (option_1, option_2, etc.)
   */
  selectSingleOption(optionKey: string): void {
    this.selectedOptions = [optionKey];
    this.saveAnswer();
  }

  /**
   * Gère la sélection d'une option pour les questions à choix multiples
   * @param optionKey Clé de l'option sélectionnée (option_1, option_2, etc.)
   * @param isChecked État de la case à cocher
   */
  toggleMultipleOption(optionKey: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedOptions.includes(optionKey)) {
        this.selectedOptions.push(optionKey);
      }
    } else {
      this.selectedOptions = this.selectedOptions.filter(opt => opt !== optionKey);
    }

    this.saveAnswer();
  }

  /**
   * Vérifie si une option est sélectionnée
   * @param optionKey Clé de l'option à vérifier
   */
  isOptionSelected(optionKey: string): boolean {
    return this.selectedOptions.includes(optionKey);
  }

  /**
   * Enregistre la réponse de l'utilisateur
   */
  saveAnswer(): void {
    if (this.question) {
      this.quizService.saveUserAnswer(this.question.id, this.selectedOptions);
    }
  }
}
