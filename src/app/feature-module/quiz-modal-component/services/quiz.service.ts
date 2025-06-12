import { Injectable } from '@angular/core';
import { Exam, Question, UserAnswer, QuizResult } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private userAnswers: UserAnswer[] = [];

  constructor() { }

  /**
   * Enregistre la réponse de l'utilisateur pour une question
   * @param questionId ID de la question
   * @param selectedOptions Options sélectionnées par l'utilisateur
   */
  saveUserAnswer(questionId: number, selectedOptions: string[]): void {
    const existingAnswerIndex = this.userAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      // Mise à jour d'une réponse existante
      this.userAnswers[existingAnswerIndex].selectedOptions = selectedOptions;
    } else {
      // Ajout d'une nouvelle réponse
      this.userAnswers.push({ questionId, selectedOptions });
    }
  }

  /**
   * Calcule le score final du quiz
   * @param exam L'examen complet avec les questions et réponses correctes
   */
  calculateResult(exam: Exam): QuizResult {
    let correctAnswers = 0;
    
    // Vérification de chaque réponse utilisateur
    this.userAnswers.forEach(userAnswer => {
      const question = exam.questions.find(q => q.id === userAnswer.questionId);
      
      if (question) {
        // Pour les questions à choix unique
        if (question.question_type === 'single_choice') {
          if (userAnswer.selectedOptions.length === 1 && 
              userAnswer.selectedOptions[0] === question.correct_option) {
            correctAnswers++;
          }
        } 
        // Pour les questions à choix multiples
        else if (question.question_type === 'multiple_choice') {
          // Vérifier que toutes les options correctes sont sélectionnées et aucune incorrecte
          const correctOptions = Object.entries(question.options)
            .filter(([_, option]) => option.is_correct)
            .map(([key, _]) => key);
          
          const allCorrectSelected = correctOptions.every(opt => userAnswer.selectedOptions.includes(opt));
          const noIncorrectSelected = userAnswer.selectedOptions.every(opt => correctOptions.includes(opt));
          
          if (allCorrectSelected && noIncorrectSelected) {
            correctAnswers++;
          }
        }
      }
    });
    
    // Calcul du score total
    const score = correctAnswers * exam.mark_per_question;
    const passed = score >= exam.pass_marks;
    
    return {
      totalQuestions: exam.nbr_question,
      correctAnswers,
      score,
      passed,
      passMarks: exam.pass_marks
    };
  }

  /**
   * Réinitialise toutes les réponses utilisateur
   */
  resetUserAnswers(): void {
    this.userAnswers = [];
  }

  /**
   * Récupère toutes les réponses de l'utilisateur
   */
  getUserAnswers(): UserAnswer[] {
    return [...this.userAnswers];
  }
}
