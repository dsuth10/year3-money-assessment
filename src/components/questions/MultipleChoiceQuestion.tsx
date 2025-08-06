import React, { useState, useCallback } from 'react';
import { MultipleChoiceQuestionProps } from '../../types/questions';

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionId,
  question,
  options,
  onAnswer,
  currentAnswer,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
  const [feedback, setFeedback] = useState<string>('');

  const handleOptionSelect = useCallback((optionId: string) => {
    if (disabled) return;
    
    setSelectedOption(optionId);
    onAnswer(optionId);
    setFeedback('Option selected. You can change your answer before submitting.');
  }, [disabled, onAnswer]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, optionId: string) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionSelect(optionId);
    }
  }, [disabled, handleOptionSelect]);

  return (
    <div className="space-y-6" role="region" aria-label={`Question ${questionId}: Multiple choice question`}>
      {/* Question Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Multiple Choice Question
        </h3>
        <p className="text-gray-600">
          Select the best answer from the options below
        </p>
      </div>

      {/* Question Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Question</h4>
        <p className="text-blue-800 text-lg">{question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Options</h4>
        <div className="space-y-2" role="radiogroup" aria-label="Answer options">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`
                relative flex items-center p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
                ${selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id)}
              role="radio"
              aria-checked={selectedOption === option.id}
              tabIndex={disabled ? -1 : 0}
              aria-describedby={`option-${option.id}-description`}
            >
              {/* Radio Button */}
              <div className="flex items-center justify-center w-5 h-5 mr-3">
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${selectedOption === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedOption === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Option Label */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {String.fromCharCode(65 + index)})
                  </span>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </div>

              {/* Option Value (for screen readers) */}
              <div 
                id={`option-${option.id}-description`}
                className="sr-only"
              >
                Option {String.fromCharCode(65 + index)}: {option.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-800" role="alert" aria-live="polite">
            {feedback}
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {selectedOption && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Your Selection</h4>
          <p className="text-green-800">
            {options.find(opt => opt.id === selectedOption)?.text}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click on an option to select it</li>
          <li>• Use Tab to navigate between options</li>
          <li>• Use Space or Enter to select an option</li>
          <li>• You can change your selection before submitting</li>
        </ul>
      </div>

      {/* Instructions for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {selectedOption 
          ? `Selected option ${options.findIndex(opt => opt.id === selectedOption) + 1}: ${options.find(opt => opt.id === selectedOption)?.text}`
          : 'No option selected. Use Tab to navigate and Space or Enter to select.'
        }
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion; 