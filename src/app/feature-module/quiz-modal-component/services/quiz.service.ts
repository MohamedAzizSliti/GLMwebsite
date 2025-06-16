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
        console.log('🔍 QuizService - Checking answer for question:', question);
        console.log('🔍 QuizService - User answer:', userAnswer);
        console.log('🔍 QuizService - Correct answer:', question.correct_answer);
        
        // Parse options from JSON string - handle double-encoded format
        let parsedOptions: any = {};
        try {
          if (question.options && typeof question.options === 'string') {
            let optionsString = question.options;
            
            // Handle double-encoded format: "\"[\\\"o1\\\",\\\"o2\\\"]\""
            if (optionsString.startsWith('"') && optionsString.endsWith('"')) {
              // Remove outer quotes
              optionsString = optionsString.slice(1, -1);
              // Replace escaped quotes
              optionsString = optionsString.replace(/\\"/g, '"');
            }
            
            const optionsArray = JSON.parse(optionsString);
            if (Array.isArray(optionsArray)) {
              // Convert array to option_1, option_2, etc. format
              optionsArray.forEach((option: string, index: number) => {
                const key = `option_${index + 1}`;
                parsedOptions[key] = {
                  text: option,
                  is_correct: (question.correct_answer === option)
                };
              });
            }
          }
        } catch (e) {
          console.error('Error parsing options:', e);
        }
        
        console.log('🔍 QuizService - Parsed options:', parsedOptions);
        
        // Check if the user's answer is correct
        let isCorrect = false;
        
        if (userAnswer.selectedOptions.length > 0) {
          // For all question types, check if any selected option matches the correct answer
          for (const selectedOptionKey of userAnswer.selectedOptions) {
            const selectedOption = parsedOptions[selectedOptionKey];
            if (selectedOption && selectedOption.text === question.correct_answer) {
              isCorrect = true;
              break;
            }
          }
        }
        
        if (isCorrect) {
          correctAnswers++;
          console.log('✅ QuizService - Answer is correct!');
        } else {
          console.log('❌ QuizService - Answer is incorrect');
          console.log('❌ QuizService - Selected options:', userAnswer.selectedOptions);
          console.log('❌ QuizService - Expected answer:', question.correct_answer);
        }
      }
    });
    
    // Calcul du score total - use percentage based on correct answers
    const totalQuestions = exam.questions.length;
    const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const passed = scorePercentage >= exam.pass_marks;
    
    console.log('🔍 QuizService - Final result:', {
      totalQuestions: totalQuestions,
      correctAnswers,
      scorePercentage: Math.round(scorePercentage * 100) / 100, // Round to 2 decimals
      passed,
      passMarks: exam.pass_marks
    });
    
    return {
      totalQuestions: totalQuestions,
      correctAnswers,
      score: Math.round(scorePercentage * 100) / 100, // Return percentage, not points
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
