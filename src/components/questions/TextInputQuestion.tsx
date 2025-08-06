import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInputQuestionProps } from '../../types/questions';

const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  questionId,
  question,
  placeholder = 'Enter your answer...',
  inputType = 'text',
  validation,
  onAnswer,
  currentAnswer = '',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState<string>(currentAnswer);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce validation
  useEffect(() => {
    if (inputValue === '') {
      setIsValid(null);
      setFeedback('');
      return;
    }

    const timeoutId = setTimeout(() => {
      if (validation) {
        const valid = validation(inputValue);
        setIsValid(valid);
        setFeedback(valid ? 'Input looks good!' : 'Please check your answer.');
      } else {
        setIsValid(true);
        setFeedback('Input entered.');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, validation]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = event.target.value;
    setInputValue(value);
    onAnswer(value);
  }, [disabled, onAnswer]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    // Allow currency formatting
    if (inputType === 'number' || inputType === 'tel') {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      const allowedChars = /[\d.,$]/;
      
      if (!allowedKeys.includes(event.key) && !allowedChars.test(event.key)) {
        event.preventDefault();
      }
    }
  }, [disabled, inputType]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const formatCurrencyInput = useCallback((value: string): string => {
    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // Add dollar sign if it's a currency input
    if (inputType === 'tel' && cleaned && !cleaned.startsWith('$')) {
      cleaned = '$' + cleaned;
    }
    
    return cleaned;
  }, [inputType]);

  const handleInputBlur = useCallback(() => {
    if (inputType === 'tel' && inputValue) {
      const formatted = formatCurrencyInput(inputValue);
      setInputValue(formatted);
      onAnswer(formatted);
    }
  }, [inputValue, inputType, formatCurrencyInput, onAnswer]);

  return (
    <div className="space-y-6" role="region" aria-label={`Question ${questionId}: Text input question`}>
      {/* Question Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Text Input Question
        </h3>
        <p className="text-gray-600">
          Enter your answer in the text field below
        </p>
      </div>

      {/* Question Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Question</h4>
        <p className="text-blue-800 text-lg">{question}</p>
      </div>

      {/* Input Field */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Your Answer</h4>
        <div className="relative">
          <input
            ref={inputRef}
            type={inputType === 'tel' ? 'text' : inputType}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onBlurCapture={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 border-2 rounded-lg text-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isFocused ? 'border-blue-500' : 'border-gray-300'}
              ${isValid === true ? 'border-green-500 bg-green-50' : ''}
              ${isValid === false ? 'border-red-500 bg-red-50' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white'}
            `}
            aria-describedby={`input-${questionId}-description input-${questionId}-feedback`}
            aria-invalid={isValid === false}
            aria-required="true"
          />
          
          {/* Input Status Icon */}
          {isValid !== null && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Input Description */}
        <div 
          id={`input-${questionId}-description`}
          className="text-sm text-gray-600"
        >
          {inputType === 'tel' 
            ? 'Enter the amount in dollars and cents (e.g., $2.50)'
            : inputType === 'number'
            ? 'Enter a number'
            : 'Enter your answer'
          }
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div 
          id={`input-${questionId}-feedback`}
          className={`p-3 rounded-lg border ${
            isValid === true 
              ? 'bg-green-50 border-green-200' 
              : isValid === false
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <p className={`text-sm ${
            isValid === true 
              ? 'text-green-800' 
              : isValid === false
              ? 'text-red-800'
              : 'text-yellow-800'
          }`} role="alert" aria-live="polite">
            {feedback}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Type your answer in the text field above</li>
          {inputType === 'tel' && (
            <>
              <li>• For currency amounts, use the format $2.50</li>
              <li>• You can type numbers and the dollar sign will be added automatically</li>
            </>
          )}
          {inputType === 'number' && (
            <li>• Enter only numbers and decimal points</li>
          )}
          <li>• The field will validate your input as you type</li>
          <li>• You can change your answer before submitting</li>
        </ul>
      </div>

      {/* Current Answer Summary */}
      {inputValue && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Your Answer</h4>
          <p className="text-blue-800 font-medium">{inputValue}</p>
        </div>
      )}

      {/* Instructions for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {inputValue 
          ? `Entered: ${inputValue}. ${isValid === true ? 'Input is valid.' : isValid === false ? 'Input needs correction.' : 'Input is being validated.'}`
          : 'No input entered. Type your answer in the text field.'
        }
      </div>
    </div>
  );
};

export default TextInputQuestion; 