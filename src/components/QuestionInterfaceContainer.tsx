import React, { useCallback, useMemo } from 'react';
import { useCurrentQuestion, useQuestionStatus } from '../stores/quizSelectors';
import { useQuizStore } from '../stores/quizStore';
import QuestionInterface from './QuestionInterface';

// Define CurrencyItem interface
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface QuestionInterfaceContainerProps {
  /** The current question data */
  question: {
    id: number;
    title: string;
    prompt: string;
    type: string;
  };
  /** Available currency items for drag-and-drop questions */
  availableCurrency?: CurrencyItem[];
  /** Drop zones configuration for drag-and-drop questions */
  dropZones?: Array<{
    id: string;
    title: string;
    description: string;
    targetValue?: number;
    acceptedTypes?: string[];
  }>;
  /** Optional custom header content */
  headerContent?: React.ReactNode;
  /** Optional custom main content */
  mainContent?: React.ReactNode;
  /** Optional custom sidebar content */
  sidebarContent?: React.ReactNode;
  /** Optional custom action buttons */
  actionButtons?: React.ReactNode;
  /** Optional custom bottom navigation */
  bottomNavigation?: React.ReactNode;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional error state */
  error?: string | null;
  /** Optional callback for question navigation */
  onQuestionChange?: (questionId: number) => void;
  /** Optional callback for quiz completion */
  onQuizComplete?: () => void;
  /** Optional callback for when items are dropped */
  onDrop?: (zoneId: string, currency: CurrencyItem) => void;
  /** Optional callback for when the answer is validated */
  onValidate?: (answer: Record<string, CurrencyItem[]>) => void;
}

const QuestionInterfaceContainer: React.FC<QuestionInterfaceContainerProps> = ({
  question,
  availableCurrency = [],
  dropZones = [],
  headerContent,
  mainContent,
  sidebarContent,
  actionButtons,
  bottomNavigation,
  isLoading = false,
  error = null,
  onQuestionChange,
  onQuizComplete,
  onDrop,
  onValidate,
  ...props
}) => {
  const currentQuestion = useCurrentQuestion();
  const questionStatus = useQuestionStatus(question.id);
  const { 
    setCurrentQuestion, 
    setAnswer, 
    getAnswer, 
    skipQuestion, 
    submitQuestion,
    isLoading: storeLoading,
    error: storeError
  } = useQuizStore();

  // Determine loading state - external override takes precedence
  const isComponentLoading = isLoading !== undefined ? isLoading : storeLoading;
  
  // Determine error state - external override takes precedence
  const componentError = error !== undefined ? error : storeError;

  // Handle question navigation
  const handleQuestionChange = useCallback((questionId: number) => {
    if (onQuestionChange) {
      onQuestionChange(questionId);
    } else {
      setCurrentQuestion(questionId);
    }
  }, [onQuestionChange, setCurrentQuestion]);

  // Handle quiz completion
  const handleQuizComplete = useCallback(() => {
    if (onQuizComplete) {
      onQuizComplete();
    }
  }, [onQuizComplete]);

  // Handle item drop for drag-and-drop questions
  const handleDrop = useCallback((zoneId: string, currency: CurrencyItem) => {
    if (onDrop) {
      onDrop(zoneId, currency);
    }
  }, [onDrop]);

  // Handle answer validation
  const handleValidate = useCallback((answer: Record<string, CurrencyItem[]>) => {
    if (onValidate) {
      onValidate(answer);
    }
  }, [onValidate]);

  // Get current answer for the question
  const currentAnswer = useMemo(() => {
    return getAnswer(question.id);
  }, [getAnswer, question.id]);

  // Handle skip action
  const handleSkip = useCallback(() => {
    skipQuestion(question.id);
  }, [skipQuestion, question.id]);

  // Handle submit action
  const handleSubmit = useCallback(() => {
    submitQuestion(question.id);
  }, [submitQuestion, question.id]);

  // Enhanced question data with status
  const enhancedQuestion = useMemo(() => ({
    ...question,
    status: questionStatus,
    hasAnswer: !!currentAnswer
  }), [question, questionStatus, currentAnswer]);

  return (
    <QuestionInterface
      question={enhancedQuestion}
      availableCurrency={availableCurrency}
      dropZones={dropZones}
      headerContent={headerContent}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
      actionButtons={actionButtons}
      bottomNavigation={bottomNavigation}
      isLoading={isComponentLoading}
      error={componentError}
      onQuestionChange={handleQuestionChange}
      onQuizComplete={handleQuizComplete}
      onDrop={handleDrop}
      onValidate={handleValidate}
      {...props}
    />
  );
};

export default QuestionInterfaceContainer; 