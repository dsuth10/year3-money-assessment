import React, { useRef, useCallback } from 'react';
import { 
  useCurrentQuestion, 
  useQuestionStatus, 
  useQuizProgress,
  useQuestionsByStatus 
} from '../stores/quizSelectors';
import { useQuizStore } from '../stores/quizStore';

interface BottomNavigationProps {
  /** Total number of questions in the quiz */
  totalQuestions?: number;
  /** Optional custom ARIA label for the navigation */
  ariaLabel?: string;
  /** Optional callback for when a question is selected */
  onQuestionSelect?: (questionId: number) => void;
  /** Optional callback for previous navigation */
  onPrevious?: () => void;
  /** Optional callback for next navigation */
  onNext?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  totalQuestions = 22,
  ariaLabel = "Quiz question navigation",
  onQuestionSelect,
  onPrevious,
  onNext
}) => {
  const currentQuestion = useCurrentQuestion();
  const quizProgress = useQuizProgress();
  const { setCurrentQuestion } = useQuizStore();
  
  // Create refs for keyboard navigation
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Get status counts for progress display
  const submittedQuestions = useQuestionsByStatus('submitted');
  const skippedQuestions = useQuestionsByStatus('skipped');
  const pendingQuestions = useQuestionsByStatus('pending');
  
  // Status labels for accessibility
  const statusLabels = {
    pending: 'pending',
    skipped: 'skipped', 
    submitted: 'submitted',
    answered: 'answered'
  } as const;

  // Handle question selection with validation
  const handleQuestionSelect = useCallback((questionIndex: number) => {
    // Validate that the question index is within bounds
    if (questionIndex < 0 || questionIndex >= totalQuestions) {
      console.warn(`Invalid question index: ${questionIndex}`);
      return;
    }

    if (onQuestionSelect) {
      onQuestionSelect(questionIndex);
    } else {
      setCurrentQuestion(questionIndex);
    }
  }, [onQuestionSelect, setCurrentQuestion, totalQuestions]);

  // Handle keyboard navigation for question indicators
  const handleQuestionKeyDown = useCallback((event: React.KeyboardEvent, questionIndex: number) => {
    let newIndex = questionIndex;
    
    switch (event.key) {
      case 'ArrowRight':
        newIndex = (questionIndex + 1) % totalQuestions;
        questionRefs.current[newIndex]?.focus();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        newIndex = (questionIndex - 1 + totalQuestions) % totalQuestions;
        questionRefs.current[newIndex]?.focus();
        event.preventDefault();
        break;
      case 'Home':
        questionRefs.current[0]?.focus();
        event.preventDefault();
        break;
      case 'End':
        questionRefs.current[totalQuestions - 1]?.focus();
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        handleQuestionSelect(questionIndex);
        event.preventDefault();
        break;
      case 'Escape':
        // Move focus out of the tablist
        const navElement = event.currentTarget.closest('nav');
        navElement?.focus();
        event.preventDefault();
        break;
    }
  }, [totalQuestions, handleQuestionSelect]);

  // Handle previous navigation
  const handlePrevious = useCallback(() => {
    if (onPrevious) {
      onPrevious();
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [onPrevious, currentQuestion, setCurrentQuestion]);

  // Handle next navigation
  const handleNext = useCallback(() => {
    if (onNext) {
      onNext();
    } else if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [onNext, currentQuestion, totalQuestions, setCurrentQuestion]);

  // Get status for a specific question
  const getQuestionStatus = useCallback((questionIndex: number): keyof typeof statusLabels => {
    const questionId = questionIndex + 1;
    // Get status from the store directly since we can't use hooks in callbacks
    const state = useQuizStore.getState();
    return state.getQuestionStatus(questionId);
  }, []);

  // Get color class based on status with WCAG AA compliant contrast
  const getStatusColor = useCallback((status: keyof typeof statusLabels) => {
    switch (status) {
      case 'skipped':
        return 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-white';
      case 'submitted':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white';
      case 'answered':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white';
      case 'pending':
      default:
        return 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 text-gray-800';
    }
  }, []);

  // Check if navigation arrows should be disabled
  const isPreviousDisabled = currentQuestion === 0;
  const isNextDisabled = currentQuestion === totalQuestions - 1;

  return (
    <nav 
      aria-label={ariaLabel}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!isPreviousDisabled) {
                handlePrevious();
              }
            }
          }}
          disabled={isPreviousDisabled}
          aria-label="Previous question"
          aria-disabled={isPreviousDisabled}
          className={`
            p-2 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPreviousDisabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }
          `}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>

        {/* Question Indicators */}
        <div 
          role="tablist" 
          aria-label="Questions"
          aria-describedby="question-navigation-instructions"
          className="flex gap-1 overflow-x-auto px-2 flex-1 justify-center"
        >
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const status = getQuestionStatus(index);
            const isCurrent = currentQuestion === index;
            const colorClass = getStatusColor(status);
            
            return (
              <button
                key={questionNumber}
                ref={el => questionRefs.current[index] = el}
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`question-panel-${index}`}
                id={`question-tab-${index}`}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => handleQuestionSelect(index)}
                onKeyDown={(e) => handleQuestionKeyDown(e, index)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${colorClass}
                  ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                `}
                aria-label={`Question ${questionNumber}, ${statusLabels[status]}`}
              >
                {String(questionNumber).padStart(2, '0')}
                <span className="sr-only">{statusLabels[status]}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!isNextDisabled) {
                handleNext();
              }
            }
          }}
          disabled={isNextDisabled}
          aria-label="Next question"
          aria-disabled={isNextDisabled}
          className={`
            p-2 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isNextDisabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }
          `}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>

        {/* Progress Counter */}
        <div className="ml-4 text-sm text-gray-700" aria-live="polite">
          <span className="font-medium">
            {submittedQuestions.length}/{totalQuestions}
          </span>
          <span className="text-gray-500 ml-1">submitted</span>
        </div>
      </div>

      {/* ARIA Live Region for Status Changes */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {`Question ${currentQuestion + 1} selected. ${submittedQuestions.length} of ${totalQuestions} questions submitted.`}
      </div>

      {/* Hidden Instructions for Screen Readers */}
      <div 
        id="question-navigation-instructions"
        className="sr-only"
        aria-live="polite"
      >
        Use arrow keys to navigate between questions. Press Enter or Space to select a question. 
        Press Home to go to the first question, End to go to the last question, or Escape to exit the question list.
      </div>
    </nav>
  );
};

export default BottomNavigation; 