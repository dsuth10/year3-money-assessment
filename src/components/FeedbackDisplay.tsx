import React from 'react';
import { useQuizStore } from '../stores/quizStore';

interface FeedbackDisplayProps {
  questionId: number;
  validationResult?: any;
  isCorrect?: boolean;
  feedback?: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  questionId,
  validationResult,
  isCorrect,
  feedback
}) => {
  const { totalScore, getProgress } = useQuizStore();
  const progress = getProgress();
  const totalQuestions = 10;

  // Determine feedback type and styling
  const getFeedbackType = () => {
    if (validationResult?.isCorrect) return 'success';
    if (validationResult?.feedback && !validationResult?.isCorrect) return 'error';
    if (feedback) return 'info';
    return 'none';
  };

  const feedbackType = getFeedbackType();

  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getFeedbackMessage = () => {
    if (validationResult?.feedback) return validationResult.feedback;
    if (feedback) return feedback;
    return null;
  };

  const feedbackMessage = getFeedbackMessage();

  return (
    <div className="space-y-4">
      {/* Question-specific Feedback */}
      {feedbackMessage && (
        <div 
          className={`p-4 rounded-lg border ${getFeedbackStyles()}`}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start gap-3">
            {getFeedbackIcon() && (
              <div className="flex-shrink-0 mt-0.5">
                {getFeedbackIcon()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {feedbackMessage}
              </p>
              {validationResult?.score !== undefined && (
                <p className="text-xs mt-1 opacity-75">
                  Score: {validationResult.score}/1
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Quiz Progress</h4>
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress / totalQuestions) * 100}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
              aria-label={`${progress} of ${totalQuestions} questions completed`}
            />
          </div>
          
          {/* Progress Stats */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Questions answered: {progress}/{totalQuestions}</span>
            <span>Current score: {totalScore.toFixed(1)}%</span>
          </div>

          {/* Question Status */}
          <div className="text-sm text-gray-600">
            <p>
              Current question: {questionId} of {totalQuestions}
            </p>
            {progress > 0 && (
              <p className="mt-1">
                {progress === totalQuestions 
                  ? 'All questions completed!'
                  : `${totalQuestions - progress} questions remaining`
                }
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Navigation Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the Previous/Next buttons to navigate between questions</li>
          <li>• Click on the numbered buttons below to jump to any question</li>
          <li>• You can change your answers before submitting</li>
          <li>• All answers are automatically saved as you work</li>
        </ul>
      </div>

      {/* Accessibility Announcements */}
      <div className="sr-only" aria-live="polite">
        {feedbackMessage && (
          <span>
            Question {questionId} feedback: {feedbackMessage}
          </span>
        )}
        <span>
          Progress: {progress} of {totalQuestions} questions completed. 
          Current score: {totalScore.toFixed(1)} percent.
        </span>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 