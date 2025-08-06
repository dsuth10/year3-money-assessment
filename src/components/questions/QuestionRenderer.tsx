import React, { useMemo } from 'react';
import { useQuizStore } from '../../stores/quizStore';
import { getAllCurrency, getCoins, getNotes } from '../../data/currency';
import {
  DragDropQuestion,
  SortingQuestion,
  MultipleChoiceQuestion,
  TextInputQuestion,
  TrueFalseQuestion
} from './index';
import { QuestionProps } from '../../types/questions';

// Question configurations for Q1-Q10
const QUESTION_CONFIGS = [
  // Q1: Drag coins to make 50¢
  {
    id: 1,
    type: 'drag-drop' as const,
    targetAmount: 0.50,
    availableCurrency: getCoins(),
    maxItems: 5
  },
  // Q2: Drag coins to make $1.00
  {
    id: 2,
    type: 'drag-drop' as const,
    targetAmount: 1.00,
    availableCurrency: getCoins(),
    maxItems: 5
  },
  // Q3: Drag note to make $5
  {
    id: 3,
    type: 'drag-drop' as const,
    targetAmount: 5.00,
    availableCurrency: getNotes(),
    maxItems: 2
  },
  // Q4: Drag coins and notes to make $2.50
  {
    id: 4,
    type: 'drag-drop' as const,
    targetAmount: 2.50,
    availableCurrency: getAllCurrency(),
    maxItems: 5
  },
  // Q5: Sort coins in ascending order
  {
    id: 5,
    type: 'sorting' as const,
    items: getCoins().slice(0, 5), // First 5 coins
    sortDirection: 'ascending' as const
  },
  // Q6: Sort notes in descending order
  {
    id: 6,
    type: 'sorting' as const,
    items: getNotes().slice(0, 4), // First 4 notes
    sortDirection: 'descending' as const
  },
  // Q7: True/False - $2.50 > $0.85
  {
    id: 7,
    type: 'true-false' as const,
    statement: '$2.50 is greater than $0.85'
  },
  // Q8: Multiple choice - equivalent value
  {
    id: 8,
    type: 'multiple-choice' as const,
    question: 'Which of the following is equivalent to $1.00?',
    options: [
      { id: 'A', text: '2 × 50¢ coins', value: 'A' },
      { id: 'B', text: '4 × 25¢ coins', value: 'B' },
      { id: 'C', text: '10 × 10¢ coins', value: 'C' },
      { id: 'D', text: 'All of the above', value: 'D' }
    ]
  },
  // Q9: Text input - simple calculation
  {
    id: 9,
    type: 'text-input' as const,
    question: 'What is $10 + 2 × $2?',
    placeholder: 'Enter the total amount...',
    inputType: 'tel' as const
  },
  // Q10: Text input - change calculation
  {
    id: 10,
    type: 'text-input' as const,
    question: 'If you pay with a $5 note for an item costing $2.75, how much change do you get?',
    placeholder: 'Enter the change amount...',
    inputType: 'tel' as const
  }
];

interface QuestionRendererProps {
  questionId: number;
  onAnswer: (answer: any) => void;
  currentAnswer?: any;
  disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  questionId,
  onAnswer,
  currentAnswer,
  disabled = false
}) => {
  const { isLoading, error } = useQuizStore();

  // Find the question configuration
  const questionConfig = useMemo(() => {
    return QUESTION_CONFIGS.find(config => config.id === questionId);
  }, [questionId]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Question</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Handle unknown question
  if (!questionConfig) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Question Not Found</h3>
        <p className="text-yellow-700">
          Question {questionId} is not available. Please contact your teacher.
        </p>
      </div>
    );
  }

  // Render the appropriate question component based on type
  const renderQuestion = () => {
    const baseProps: QuestionProps = {
      questionId,
      onAnswer,
      currentAnswer,
      disabled
    };

    switch (questionConfig.type) {
      case 'drag-drop':
        return (
          <DragDropQuestion
            {...baseProps}
            targetAmount={questionConfig.targetAmount}
            availableCurrency={questionConfig.availableCurrency}
            maxItems={questionConfig.maxItems}
          />
        );

      case 'sorting':
        return (
          <SortingQuestion
            {...baseProps}
            items={questionConfig.items}
            sortDirection={questionConfig.sortDirection}
          />
        );

      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            {...baseProps}
            question={questionConfig.question}
            options={questionConfig.options}
          />
        );

      case 'text-input':
        return (
          <TextInputQuestion
            {...baseProps}
            question={questionConfig.question}
            placeholder={questionConfig.placeholder}
            inputType={questionConfig.inputType}
          />
        );

      case 'true-false':
        return (
          <TrueFalseQuestion
            {...baseProps}
            statement={questionConfig.statement}
          />
        );

      default:
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unsupported Question Type</h3>
            <p className="text-red-700">
              Question type "{questionConfig.type}" is not supported.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="question-renderer">
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer; 