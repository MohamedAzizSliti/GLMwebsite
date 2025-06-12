import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizModalService } from '../../services/quiz-modal.service';
import { TimerService } from '../../services/timer.service';
import { QuizService } from '../../services/quiz.service';
import { Exam, QuizResult } from '../../models/exam.model';
import {QuizResultComponent} from "../quiz-result/quiz-result.component";
import {QuestionComponent} from "../question/question.component";
import {CommonModule} from "@angular/common";
import {TimerComponent} from "../timer/timer.component";

@Component({
  selector: 'app-quiz-modal',
  templateUrl: './quiz-modal.component.html',
  standalone:true,
  imports : [
    QuizResultComponent,
    QuestionComponent,
    CommonModule,
    TimerComponent
  ],
  styleUrls: ['./quiz-modal.component.scss']
})
export class QuizModalComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  isOpen = false;
  currentQuestionIndex = 0;
  quizCompleted = false;
  quizResult: QuizResult | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private quizModalService: QuizModalService,
    private timerService: TimerService,
    private quizService: QuizService
  ) {

  }

  ngOnInit(): void {
    // S'abonner aux changements d'état de la modale

    this.subscriptions.push(
      this.quizModalService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
        if (!isOpen) {
          this.resetQuiz();
        }
      })
    );

    // S'abonner aux changements d'examen
    this.subscriptions.push(
      this.quizModalService.currentExam$.subscribe(exam => {
        if (exam) {
          this.exam = exam;
          this.startQuiz();
        }
      })
    );

    // S'abonner au minuteur pour détecter la fin du temps
    this.subscriptions.push(
      this.timerService.remainingTime$.subscribe(time => {
        if (time === 0 && this.isOpen && !this.quizCompleted) {
          this.finishQuiz();
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Nettoyer les abonnements
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.timerService.stopTimer();
  }

  /**
   * Démarre le quiz et initialise le minuteur
   */
  startQuiz(): void {
    if (this.exam) {
      this.currentQuestionIndex = 0;
      this.quizCompleted = false;
      this.quizResult = null;
      this.quizService.resetUserAnswers();
      this.timerService.startTimer(this.exam.duration);
    }
  }

  /**
   * Passe à la question suivante
   */
  nextQuestion(): void {
    if (this.exam && this.currentQuestionIndex < this.exam.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finishQuiz();
    }
  }

  /**
   * Revient à la question précédente
   */
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  /**
   * Termine le quiz et calcule le résultat
   */
  finishQuiz(): void {
    this.timerService.stopTimer();
    this.quizCompleted = true;

    if (this.exam) {
      this.quizResult = this.quizService.calculateResult(this.exam);
    }
  }

  /**
   * Réinitialise l'état du quiz
   */
  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.quizCompleted = false;
    this.quizResult = null;
    this.timerService.resetTimer();
    this.quizService.resetUserAnswers();
  }

  /**
   * Ferme la modale
   */
  closeModal(): void {
    this.quizModalService.closeModal();
  }

  /**
   * Récupère la question courante
   */
  get currentQuestion() {
    return this.exam?.questions[this.currentQuestionIndex] || null;
  }
}
