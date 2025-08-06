import React, { useState, useCallback } from 'react';
import { TrueFalseQuestionProps } from '../../types/questions';

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  questionId,
  statement,
  onAnswer,
  currentAnswer,
  disabled = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | undefined>(currentAnswer);
  const [feedback, setFeedback] = useState<string>('');

  const handleAnswerSelect = useCallback((answer: boolean) => {
    if (disabled) return;
    
    setSelectedAnswer(answer);
    onAnswer(answer);
    setFeedback(`You selected ${answer ? 'True' : 'False'}. You can change your answer before submitting.`);
  }, [disabled, onAnswer]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, answer: boolean) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAnswerSelect(answer);
    }
  }, [disabled, handleAnswerSelect]);

  return (
    <div className="space-y-6" role="region" aria-label={`Question ${questionId}: True or false question`}>
      {/* Question Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          True or False Question
        </h3>
        <p className="text-gray-600">
          Read the statement below and decide if it's true or false
        </p>
      </div>

      {/* Statement */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Statement</h4>
        <p className="text-blue-800 text-lg">{statement}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Your Answer</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="True or false options">
          {/* True Option */}
          <div
            className={`
              relative flex items-center p-4 border-2 rounded-lg cursor-pointer
              transition-all duration-200
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
              ${selectedAnswer === true
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleAnswerSelect(true)}
            onKeyDown={(e) => handleKeyDown(e, true)}
            role="radio"
            aria-checked={selectedAnswer === true}
            tabIndex={disabled ? -1 : 0}
            aria-describedby="true-option-description"
          >
            {/* Radio Button */}
            <div className="flex items-center justify-center w-5 h-5 mr-3">
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${selectedAnswer === true
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
                }
              `}>
                {selectedAnswer === true && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* True Label */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="font-medium text-gray-900">True</span>
              </div>
            </div>

            {/* Description for Screen Readers */}
            <div id="true-option-description" className="sr-only">
              Select True if the statement is correct
            </div>
          </div>

          {/* False Option */}
          <div
            className={`
              relative flex items-center p-4 border-2 rounded-lg cursor-pointer
              transition-all duration-200
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
              ${selectedAnswer === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleAnswerSelect(false)}
            onKeyDown={(e) => handleKeyDown(e, false)}
            role="radio"
            aria-checked={selectedAnswer === false}
            tabIndex={disabled ? -1 : 0}
            aria-describedby="false-option-description"
          >
            {/* Radio Button */}
            <div className="flex items-center justify-center w-5 h-5 mr-3">
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${selectedAnswer === false
                  ? 'border-red-500 bg-red-500'
                  : 'border-gray-300'
                }
              `}>
                {selectedAnswer === false && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* False Label */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">❌</span>
                <span className="font-medium text-gray-900">False</span>
              </div>
            </div>

            {/* Description for Screen Readers */}
            <div id="false-option-description" className="sr-only">
              Select False if the statement is incorrect
            </div>
          </div>
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
      {selectedAnswer !== undefined && (
        <div className={`rounded-lg p-4 ${
          selectedAnswer 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            selectedAnswer ? 'text-green-900' : 'text-red-900'
          }`}>
            Your Selection
          </h4>
          <p className={`font-medium ${
            selectedAnswer ? 'text-green-800' : 'text-red-800'
          }`}>
            {selectedAnswer ? 'True' : 'False'}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Read the statement carefully</li>
          <li>• Click on True if the statement is correct</li>
          <li>• Click on False if the statement is incorrect</li>
          <li>• Use Tab to navigate between options</li>
          <li>• Use Space or Enter to select an option</li>
          <li>• You can change your answer before submitting</li>
        </ul>
      </div>

      {/* Instructions for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {selectedAnswer !== undefined 
          ? `Selected: ${selectedAnswer ? 'True' : 'False'}. You can change your answer before submitting.`
          : 'No answer selected. Use Tab to navigate and Space or Enter to select True or False.'
        }
      </div>
    </div>
  );
};

export default TrueFalseQuestion; 