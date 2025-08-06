import { CurrencyItem } from '../types/currency';
import { QuestionValidationResult } from '../types/questions';

// Validation functions for different question types

export const validateDragDropAnswer = (
  answer: CurrencyItem[],
  targetAmount: number,
  maxItems?: number
): QuestionValidationResult => {
  // Check if answer is provided
  if (!answer || !Array.isArray(answer)) {
    return {
      isCorrect: false,
      feedback: 'Please select some currency items.',
      score: 0
    };
  }

  // Check if too many items selected
  if (maxItems && answer.length > maxItems) {
    return {
      isCorrect: false,
      feedback: `You can only select up to ${maxItems} items.`,
      score: 0
    };
  }

  // Calculate total value
  const totalValue = answer.reduce((sum, item) => sum + item.value, 0);

  // Check if total matches target
  if (Math.abs(totalValue - targetAmount) < 0.01) {
    return {
      isCorrect: true,
      feedback: 'Perfect! You have the exact amount.',
      score: 1
    };
  } else if (totalValue > targetAmount) {
    const excess = totalValue - targetAmount;
    return {
      isCorrect: false,
      feedback: `You have $${excess.toFixed(2)} too much. Try removing some items.`,
      score: 0
    };
  } else {
    const shortfall = targetAmount - totalValue;
    return {
      isCorrect: false,
      feedback: `You need $${shortfall.toFixed(2)} more. Try adding more items.`,
      score: 0
    };
  }
};

export const validateSortingAnswer = (
  answer: CurrencyItem[],
  expectedDirection: 'ascending' | 'descending'
): QuestionValidationResult => {
  // Check if answer is provided
  if (!answer || !Array.isArray(answer) || answer.length === 0) {
    return {
      isCorrect: false,
      feedback: 'Please arrange the items in order.',
      score: 0
    };
  }

  // Check if all items are in correct order
  for (let i = 1; i < answer.length; i++) {
    const prevValue = answer[i - 1].value;
    const currentValue = answer[i].value;
    
    if (expectedDirection === 'ascending' && prevValue > currentValue) {
      return {
        isCorrect: false,
        feedback: 'Items are not in ascending order. Sort from lowest to highest value.',
        score: 0
      };
    }
    
    if (expectedDirection === 'descending' && prevValue < currentValue) {
      return {
        isCorrect: false,
        feedback: 'Items are not in descending order. Sort from highest to lowest value.',
        score: 0
      };
    }
  }

  return {
    isCorrect: true,
    feedback: 'Perfect! The items are sorted correctly.',
    score: 1
  };
};

export const validateMultipleChoiceAnswer = (
  answer: string,
  correctAnswer: string
): QuestionValidationResult => {
  if (!answer) {
    return {
      isCorrect: false,
      feedback: 'Please select an answer.',
      score: 0
    };
  }

  const isCorrect = answer === correctAnswer;
  
  return {
    isCorrect,
    feedback: isCorrect 
      ? 'Correct! Well done.' 
      : 'Incorrect. Please try again.',
    score: isCorrect ? 1 : 0
  };
};

export const validateTextInputAnswer = (
  answer: string,
  correctAnswer: string | number,
  tolerance: number = 0.01
): QuestionValidationResult => {
  if (!answer || answer.trim() === '') {
    return {
      isCorrect: false,
      feedback: 'Please enter an answer.',
      score: 0
    };
  }

  // Clean the answer (remove currency symbols, spaces, etc.)
  const cleanAnswer = answer.replace(/[$,]/g, '').trim();
  
  // Try to parse as number
  const numericAnswer = parseFloat(cleanAnswer);
  
  if (isNaN(numericAnswer)) {
    return {
      isCorrect: false,
      feedback: 'Please enter a valid number.',
      score: 0
    };
  }

  // Check if answer is within tolerance
  const correctNumeric = typeof correctAnswer === 'string' ? parseFloat(correctAnswer) : correctAnswer;
  
  if (Math.abs(numericAnswer - correctNumeric) <= tolerance) {
    return {
      isCorrect: true,
      feedback: 'Correct! Well done.',
      score: 1
    };
  } else {
    return {
      isCorrect: false,
      feedback: `Incorrect. The correct answer is $${correctNumeric.toFixed(2)}.`,
      score: 0
    };
  }
};

export const validateTrueFalseAnswer = (
  answer: boolean,
  correctAnswer: boolean
): QuestionValidationResult => {
  if (answer === undefined || answer === null) {
    return {
      isCorrect: false,
      feedback: 'Please select True or False.',
      score: 0
    };
  }

  const isCorrect = answer === correctAnswer;
  
  return {
    isCorrect,
    feedback: isCorrect 
      ? 'Correct! Well done.' 
      : 'Incorrect. Please try again.',
    score: isCorrect ? 1 : 0
  };
};

// Question-specific validation functions

export const validateQuestion1 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateDragDropAnswer(answer, 0.50, 5);
};

export const validateQuestion2 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateDragDropAnswer(answer, 1.00, 5);
};

export const validateQuestion3 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateDragDropAnswer(answer, 5.00, 2);
};

export const validateQuestion4 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateDragDropAnswer(answer, 2.50, 5);
};

export const validateQuestion5 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateSortingAnswer(answer, 'ascending');
};

export const validateQuestion6 = (answer: CurrencyItem[]): QuestionValidationResult => {
  return validateSortingAnswer(answer, 'descending');
};

export const validateQuestion7 = (answer: boolean): QuestionValidationResult => {
  return validateTrueFalseAnswer(answer, true); // $2.50 > $0.85 is true
};

export const validateQuestion8 = (answer: string): QuestionValidationResult => {
  return validateMultipleChoiceAnswer(answer, 'D'); // All of the above
};

export const validateQuestion9 = (answer: string): QuestionValidationResult => {
  return validateTextInputAnswer(answer, 14.00); // $10 + 2 × $2 = $14
};

export const validateQuestion10 = (answer: string): QuestionValidationResult => {
  return validateTextInputAnswer(answer, 2.25); // $5 - $2.75 = $2.25
};

// Main validation function that routes to appropriate validator
export const validateAnswer = (
  questionId: number,
  answer: any
): QuestionValidationResult => {
  const validators: Record<number, (answer: any) => QuestionValidationResult> = {
    1: validateQuestion1,
    2: validateQuestion2,
    3: validateQuestion3,
    4: validateQuestion4,
    5: validateQuestion5,
    6: validateQuestion6,
    7: validateQuestion7,
    8: validateQuestion8,
    9: validateQuestion9,
    10: validateQuestion10
  };

  const validator = validators[questionId];
  
  if (!validator) {
    return {
      isCorrect: false,
      feedback: `No validator found for question ${questionId}.`,
      score: 0
    };
  }

  try {
    return validator(answer);
  } catch (error) {
    console.error(`Validation error for question ${questionId}:`, error);
    return {
      isCorrect: false,
      feedback: 'An error occurred while validating your answer. Please try again.',
      score: 0
    };
  }
};

// Utility function to calculate total score
export const calculateTotalScore = (answers: Record<number, string>): number => {
  let totalScore = 0;
  let totalQuestions = 0;

  Object.entries(answers).forEach(([questionIdStr, answerStr]) => {
    const questionId = parseInt(questionIdStr);
    if (questionId >= 1 && questionId <= 10) {
      try {
        const answer = JSON.parse(answerStr);
        const result = validateAnswer(questionId, answer);
        totalScore += result.score;
        totalQuestions++;
      } catch (error) {
        console.error(`Error calculating score for question ${questionId}:`, error);
      }
    }
  });

  return totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
}; 