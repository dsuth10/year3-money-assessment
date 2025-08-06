// Define CurrencyItem interface locally to avoid import issues
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

// Question status types for enhanced state management
export type QuestionStatus = 'pending' | 'skipped' | 'submitted' | 'answered';

export interface QuestionState {
  status: QuestionStatus;
  answer?: string;
  submittedAt?: number;
  skippedAt?: number;
  validationResult?: QuestionValidationResult;
}

export interface QuestionProgress {
  totalQuestions: number;
  pendingQuestions: number;
  skippedQuestions: number;
  submittedQuestions: number;
  answeredQuestions: number;
  progressPercentage: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  questionStates: Record<number, QuestionState>;
  isQuizActive: boolean;
  quizId: string | null;
  studentId: string | null;
  currentAttemptId: number | null;
  isLoading: boolean;
  error: string | null;
  validationResults: Record<number, any>;
  totalScore: number;
}

export interface QuizActions {
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestion: (question: number) => void;
  startQuiz: (quizId: string, studentId: string) => Promise<void>;
  resetQuiz: () => void;
  getAnswer: (questionId: number) => string | undefined;
  getProgress: () => number;
  saveAnswer: (questionId: number, answer: string) => Promise<void>;
  validateAnswer: (questionId: number, answer: any) => any;
  completeQuiz: () => Promise<void>;
  loadAttempt: (attemptId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
  // New status management actions
  skipQuestion: (questionId: number) => void;
  submitQuestion: (questionId: number, answer?: string) => void;
  getQuestionStatus: (questionId: number) => QuestionStatus;
  updateQuestionStatus: (questionId: number, status: QuestionStatus) => void;
  getQuestionProgress: () => QuestionProgress;
}

export type QuizStore = QuizState & QuizActions;

export interface QuestionProps {
  questionId: number;
  onAnswer: (answer: any) => void;
  currentAnswer?: any;
  disabled?: boolean;
}

export interface DragDropQuestionProps extends QuestionProps {
  targetAmount: number;
  availableCurrency: CurrencyItem[];
  maxItems?: number;
}

export interface SortingQuestionProps extends QuestionProps {
  items: CurrencyItem[];
  sortDirection: 'ascending' | 'descending';
}

export interface MultipleChoiceQuestionProps extends QuestionProps {
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
}

export interface TextInputQuestionProps extends QuestionProps {
  question: string;
  placeholder?: string;
  inputType?: 'text' | 'number' | 'tel';
  validation?: (value: string) => boolean;
}

export interface TrueFalseQuestionProps extends QuestionProps {
  statement: string;
}

export interface QuestionValidationResult {
  isCorrect: boolean;
  feedback: string;
  score: number;
}

export interface QuestionConfig {
  id: number;
  type: 'drag-drop' | 'sorting' | 'multiple-choice' | 'text-input' | 'true-false';
  title: string;
  description: string;
  correctAnswer: any;
  validation?: (answer: any) => QuestionValidationResult;
}

export type QuestionComponent = React.ComponentType<QuestionProps>; 