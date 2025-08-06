// Define CurrencyItem interface locally to avoid import issues
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

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