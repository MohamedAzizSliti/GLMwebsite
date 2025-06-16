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
  session_id?: number;
  is_quiz?: boolean;
}

export interface Question {
  id: number;
  course_id: number;
  exam_id: number;
  quiz_id: number | null;
  question: string;
  question_text?: string;
  type: 'multiple_choice' | 'single_choice' | 'binary';
  question_type?: 'multiple_choice' | 'single_choice' | 'binary';
  options: string; // JSON string like "[\"Oui\",\"Non\"]"
  correct_answer: string; // String like "Oui"
  created_at: string;
  updated_at: string;
  explanation?: string;
  marks?: number;
  order?: number;
  is_active?: boolean;
  [key: string]: any;
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
