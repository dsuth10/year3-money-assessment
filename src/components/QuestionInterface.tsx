import React from 'react';
import { useCurrentQuestion, useQuestionStatus } from '../stores/quizSelectors';
import { useQuizStore } from '../stores/quizStore';
import QuestionActionButtons from './QuestionActionButtons';
import BottomNavigation from './BottomNavigation';
import DragDropQuestionInterface from './questions/DragDropQuestionInterface';

// Define CurrencyItem interface
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface QuestionInterfaceProps {
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

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
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
  onValidate
}) => {
  const currentQuestion = useCurrentQuestion();
  const questionStatus = useQuestionStatus(question.id);
  const { setCurrentQuestion } = useQuizStore();

  // Handle question navigation
  const handleQuestionChange = (questionId: number) => {
    if (onQuestionChange) {
      onQuestionChange(questionId);
    } else {
      setCurrentQuestion(questionId);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = () => {
    if (onQuizComplete) {
      onQuizComplete();
    }
  };

  // Determine if this is a drag-and-drop question
  const isDragDropQuestion = question.type === 'drag-drop' || question.type === 'currency-drag-drop';

  // Render appropriate content based on question type
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <svg 
              className="animate-spin h-6 w-6 text-blue-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
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
            <span className="text-gray-600">Loading question...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">
              Error loading question
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      );
    }

    if (mainContent) {
      return mainContent;
    }

    if (isDragDropQuestion) {
      return (
        <DragDropQuestionInterface
          question={question}
          availableCurrency={availableCurrency}
          dropZones={dropZones}
          onDrop={onDrop}
          onValidate={onValidate}
          isLoading={isLoading}
          disabled={false}
        />
      );
    }

    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Question Content
        </h3>
        <p className="text-gray-500">
          Main question content will be rendered here
        </p>
      </div>
    );
  };

  // Render appropriate sidebar content
  const renderSidebarContent = () => {
    if (sidebarContent) {
      return sidebarContent;
    }

    if (isDragDropQuestion) {
      return null; // Sidebar content is handled within DragDropQuestionInterface
    }

    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-2xl mb-2">💰</div>
        <p className="text-gray-500 text-sm">
          Currency items will be displayed here
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Question Title and Counter */}
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {question.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Question</span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {question.id}
                </span>
              </div>
            </div>

            {/* Custom Header Content */}
            {headerContent && (
              <div className="flex items-center space-x-4">
                {headerContent}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Content Area - Question and Drag Zone */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Question Prompt - Only show if not a drag-drop question */}
            {!isDragDropQuestion && (
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {question.prompt}
                </h2>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1">
              {renderMainContent()}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Currency Items (only for non-drag-drop questions) */}
        {!isDragDropQuestion && (
          <div className="w-full lg:w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Available Currency
              </h3>
              
              {renderSidebarContent()}
            </div>
          </div>
        )}
      </main>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          {actionButtons ? (
            actionButtons
          ) : (
            <QuestionActionButtons 
              questionId={question.id}
              skipAriaLabel={`Skip question ${question.id}`}
              submitAriaLabel={`Submit answer for question ${question.id}`}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      {bottomNavigation ? (
        bottomNavigation
      ) : (
        <BottomNavigation 
          totalQuestions={22}
          ariaLabel="Quiz question navigation"
          onQuestionSelect={handleQuestionChange}
        />
      )}
    </div>
  );
};

export default QuestionInterface; 