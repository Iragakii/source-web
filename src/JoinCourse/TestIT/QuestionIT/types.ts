export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TestState {
  currentQuestion: number;
  answers: number[];
  score: number;
  isCompleted: boolean;
  timeRemaining: number;
}
