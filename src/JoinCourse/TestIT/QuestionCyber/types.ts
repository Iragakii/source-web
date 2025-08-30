export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TestState {
  currentQuestion: number;
  answers: number[];
  score: number;
  isCompleted: boolean;
  timeRemaining: number;
}
