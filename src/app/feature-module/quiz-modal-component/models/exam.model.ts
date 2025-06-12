export interface Exam {
  id: number;
  title: string;
  duration: number;
  mark_per_question: number;
  pass_marks: number;
  course_id: number;
  created_at: string;
  updated_at: string;
  nbr_question: number;
  questions: Question[];
}

export interface Question {
  id: number;
  course_id: number;
  exam_id: number;
  quiz_id: number | null;
  question_text: string;
  question_type: 'multiple_choice' | 'single_choice';
  options: {
    option_1: Option;
    option_2: Option;
    option_3: Option;
    option_4: Option;
  };
  created_at: string;
  updated_at: string;
  option_1: Option;
  option_2: Option;
  option_3: Option;
  option_4: Option;
  correct_option: string;
}

export interface Option {
  text: string | null;
  is_correct: boolean;
}

export interface UserAnswer {
  questionId: number;
  selectedOptions: string[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  passMarks: number;
}
