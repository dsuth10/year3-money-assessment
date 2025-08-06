import React from 'react';
import { useQuizStore } from '../stores/quizStore';

interface QuestionActionButtonsProps {
  /** The ID of the question these buttons apply to */
  questionId: number;
  /** Optional custom ARIA label for the skip button */
  skipAriaLabel?: string;
  /** Optional custom ARIA label for the submit button */
  submitAriaLabel?: string;
  /** Optional callback to override default skip behavior */
  onSkip?: (questionId: number) => void;
  /** Optional callback to override default submit behavior */
  onSubmit?: (questionId: number) => void;
  /** Optional loading state override */
  isLoading?: boolean;
  /** Optional disabled state override */
  disabled?: boolean;
}

const QuestionActionButtons: React.FC<QuestionActionButtonsProps> = ({
  questionId,
  skipAriaLabel = `Skip question ${questionId}`,
  submitAriaLabel = `Submit answer for question ${questionId}`,
  onSkip,
  onSubmit,
  isLoading: externalLoading,
  disabled: externalDisabled = false
}) => {
  const { skipQuestion, submitQuestion, isLoading: storeLoading } = useQuizStore();
  
  // Determine loading state - external override takes precedence
  const isLoading = externalLoading !== undefined ? externalLoading : storeLoading;
  
  // Determine disabled state - external override or loading state
  const disabled = externalDisabled || isLoading;

  const handleSkip = () => {
    if (disabled) return;
    
    if (onSkip) {
      onSkip(questionId);
    } else {
      skipQuestion(questionId);
    }
  };

  const handleSubmit = () => {
    if (disabled) return;
    
    if (onSubmit) {
      onSubmit(questionId);
    } else {
      submitQuestion(questionId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div 
      className="flex gap-3 justify-center mt-6"
      role="group"
      aria-label={`Action buttons for question ${questionId}`}
    >
      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        onKeyDown={(e) => handleKeyDown(e, handleSkip)}
        disabled={disabled}
        aria-label={skipAriaLabel}
        aria-describedby={isLoading ? `skip-loading-${questionId}` : undefined}
        className={`
          px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm hover:shadow-md'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg 
              className="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Skipping...</span>
          </div>
        ) : (
          'Skip'
        )}
      </button>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
        disabled={disabled}
        aria-label={submitAriaLabel}
        aria-describedby={isLoading ? `submit-loading-${questionId}` : undefined}
        className={`
          px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg 
              className="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit'
        )}
      </button>

      {/* ARIA Live Regions for Loading Announcements */}
      {isLoading && (
        <>
          <div 
            id={`skip-loading-${questionId}`}
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Skip button is processing, please wait
          </div>
          <div 
            id={`submit-loading-${questionId}`}
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Submit button is processing, please wait
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionActionButtons; 