import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface Question {
  id: number;
  question?: string;
  question_text?: string;
  type?: string;
  question_type?: string;
  options?: any;
  option_1?: any;
  option_2?: any;
  option_3?: any;
  option_4?: any;
  correct_answer?: string;
  points?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {
  @Input() question: Question | null = null;
  @Input() selectedAnswers: string[] = [];
  @Input() showDebug: boolean = false;
  @Output() answerSelected = new EventEmitter<string[]>();

  formattedOptions: any = {};

  ngOnInit() {
    console.log('🔧 QuestionComponent initialized with question:', this.question);
    this.formatOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question) {
      console.log('🔧 Question changed:', this.question);
      this.formatOptions();
    }
  }

  formatOptions() {
    if (!this.question) {
      console.warn('⚠️ No question provided to format options');
      return;
    }

    console.log('🔧 Formatting options for question:', this.question);
    
    // Handle the backend format where options is a JSON string
    if (this.question.options && typeof this.question.options === 'string') {
      try {
        const optionsArray = JSON.parse(this.question.options);
        console.log('🔧 Parsed options array:', optionsArray);
        
        if (Array.isArray(optionsArray)) {
          const optionsObj: any = {};
          
          // Handle different question types
          if (this.question.type === 'binary') {
            // Binary questions: ["Oui","Non"] -> option_1: Oui, option_2: Non
            optionsObj.option_1 = {
              text: optionsArray[0] || 'Oui',
              is_correct: (this.question.correct_answer === optionsArray[0])
            };
            optionsObj.option_2 = {
              text: optionsArray[1] || 'Non', 
              is_correct: (this.question.correct_answer === optionsArray[1])
            };
          } else if (this.question.type === 'single_choice') {
            // Single choice: ["o1","o2"] -> option_1: o1, option_2: o2
            optionsArray.forEach((option: string, index: number) => {
              if (index < 4) { // Limit to 4 options
                const key = `option_${index + 1}`;
                optionsObj[key] = {
                  text: option,
                  is_correct: (this.question.correct_answer === option)
                };
              }
            });
          } else if (this.question.type === 'multiple_choice') {
            // Multiple choice: ["o1","o2","o3"] -> option_1: o1, option_2: o2, option_3: o3
            optionsArray.forEach((option: string, index: number) => {
              if (index < 4) { // Limit to 4 options
                const key = `option_${index + 1}`;
                optionsObj[key] = {
                  text: option,
                  is_correct: (this.question.correct_answer === option)
                };
              }
            });
          }
          
          this.formattedOptions = optionsObj;
          console.log('🔧 Formatted options:', this.formattedOptions);
          return;
        }
      } catch (e) {
        console.error('❌ Error parsing options JSON:', e);
      }
    }
    
    // Fallback: Handle other formats
    if (this.question.options && typeof this.question.options === 'object' && !Array.isArray(this.question.options)) {
      this.formattedOptions = this.question.options;
    } else if (this.question.option_1 || this.question.option_2) {
      const options: any = {};
      if (this.question.option_1) options.option_1 = this.question.option_1;
      if (this.question.option_2) options.option_2 = this.question.option_2;
      if (this.question.option_3) options.option_3 = this.question.option_3;
      if (this.question.option_4) options.option_4 = this.question.option_4;
      this.formattedOptions = options;
    } else if (this.question.type === 'binary') {
      // Default fallback for binary questions
      this.formattedOptions = {
        option_1: { text: 'Oui', is_correct: this.question.correct_answer === 'Oui' },
        option_2: { text: 'Non', is_correct: this.question.correct_answer === 'Non' }
      };
    } else {
      console.warn('⚠️ No valid options found for question:', this.question);
      this.formattedOptions = {};
    }
  }

  getOptionsArray(): Array<{key: string, value: any}> {
    if (!this.formattedOptions) return [];
    
    return Object.keys(this.formattedOptions).map(key => ({
      key: key,
      value: this.formattedOptions[key]
    }));
  }

  getOptionText(option: any): string {
    if (typeof option === 'string') {
      return option;
    }
    if (option && typeof option === 'object') {
      return option.text || option.value || 'Option';
    }
    return 'Option';
  }

  getOptionLetter(optionKey: string): string {
    const letters = ['A', 'B', 'C', 'D'];
    const index = parseInt(optionKey.replace('option_', '')) - 1;
    return letters[index] || optionKey;
  }

  getQuestionTypeLabel(): string {
    if (!this.question?.type) return 'Question';
    
    switch (this.question.type) {
      case 'binary':
        return 'Vrai/Faux';
      case 'single_choice':
        return 'Choix unique';
      case 'multiple_choice':
        return 'Choix multiple';
      default:
        return 'Question';
    }
  }

  selectOption(optionKey: string) {
    console.log('🔧 Option selected:', optionKey);
    
    if (this.question?.type === 'multiple_choice') {
      // For multiple choice, use toggle behavior
      this.toggleMultipleOption(optionKey);
    } else {
      // For single choice and binary, replace selection
      this.selectedAnswers = [optionKey];
      this.answerSelected.emit(this.selectedAnswers);
    }
  }

  toggleMultipleOption(optionKey: string) {
    console.log('🔧 Toggling multiple option:', optionKey);
    
    const index = this.selectedAnswers.indexOf(optionKey);
    if (index > -1) {
      // Remove if already selected
      this.selectedAnswers = this.selectedAnswers.filter(answer => answer !== optionKey);
    } else {
      // Add if not selected
      this.selectedAnswers = [...this.selectedAnswers, optionKey];
    }
    
    this.answerSelected.emit(this.selectedAnswers);
  }
} 