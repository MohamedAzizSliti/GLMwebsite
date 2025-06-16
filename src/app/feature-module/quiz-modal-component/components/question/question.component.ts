import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Question } from '../../models/exam.model';
import { QuizService } from '../../services/quiz.service';

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
  formattedOptions: any = {};

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.loadSelectedOptions();
    this.formatQuestionOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recharger les options sélectionnées à chaque changement de question
    if (changes['question'] && !changes['question'].firstChange) {
      this.loadSelectedOptions();
      this.formatQuestionOptions();
    }
  }

  /**
   * Format question options from backend JSON string format to usable object
   */
  formatQuestionOptions(): void {
    if (!this.question) {
      this.formattedOptions = {};
      return;
    }
    
    // Handle the exact format from your data: "\"[\\\"o1\\\",\\\"o2\\\"]\""
    if (this.question.options && typeof this.question.options === 'string') {
      try {
        let optionsString = this.question.options;
        
        // Remove the outer quotes and unescape the inner JSON
        // From: "\"[\\\"o1\\\",\\\"o2\\\"]\""
        // To: ["o1","o2"]
        if (optionsString.startsWith('"') && optionsString.endsWith('"')) {
          // Remove outer quotes
          optionsString = optionsString.slice(1, -1);
          // Replace escaped quotes
          optionsString = optionsString.replace(/\\"/g, '"');
        }
        
        // Now parse the JSON array
        const optionsArray = JSON.parse(optionsString);
        
        if (Array.isArray(optionsArray) && optionsArray.length > 0) {
          const optionsObj: any = {};
          
          // Convert array to option_1, option_2, etc. format
          optionsArray.forEach((option: string, index: number) => {
            if (index < 4) { // Limit to 4 options max
              const key = `option_${index + 1}`;
              optionsObj[key] = {
                text: option,
                is_correct: (this.question?.correct_answer === option)
              };
            }
          });
          
          this.formattedOptions = optionsObj;
          return;
        }
      } catch (e) {
        console.error('❌ Error parsing options JSON:', e);
      }
    }
    
    // Fallback for binary questions
    if (this.question.type === 'binary') {
      this.formattedOptions = {
        option_1: { text: 'Oui', is_correct: this.question?.correct_answer === 'Oui' },
        option_2: { text: 'Non', is_correct: this.question?.correct_answer === 'Non' }
      };
    } else {
      this.formattedOptions = {};
    }
  }

  /**
   * Get option text from different possible data structures
   */
  getOptionText(optionKey: string): string | null {
    if (!this.question) {
      return null;
    }

    // Use formatted options first (this is where the JSON string gets parsed)
    if (this.formattedOptions && this.formattedOptions[optionKey]) {
      const option = this.formattedOptions[optionKey];
      
      // If option is a string, return it directly
      if (typeof option === 'string') {
        return option;
      } 
      // If option is an object with text property, return the text
      else if (option && typeof option === 'object' && option.text) {
        return option.text;
      }
      // If option is an object but no text property, try to convert to string
      else if (option && typeof option === 'object') {
        return String(option);
      }
    }

    // Fallback: For binary questions, provide default values
    if (this.question.type === 'binary') {
      if (optionKey === 'option_1') {
        return 'Oui';
      } else if (optionKey === 'option_2') {
        return 'Non';
      }
    }
    
    return null;
  }

  /**
   * Get available option keys dynamically from formatted options
   */
  getAvailableOptionKeys(): string[] {
    if (!this.formattedOptions) {
      return [];
    }
    
    const keys = Object.keys(this.formattedOptions).filter(key => {
      const option = this.formattedOptions[key];
      // Only include options that have actual text content
      return option && (
        (typeof option === 'string' && option.trim().length > 0) ||
        (typeof option === 'object' && option.text && option.text.trim().length > 0)
      );
    });
    
    return keys;
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