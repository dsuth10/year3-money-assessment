import type { Answer, Question, QuestionType } from '../types/questions';

// Enhanced validation utilities with latest TypeScript patterns and better error handling
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  score?: number;
}

export interface AnswerValidation {
  isCorrect: boolean;
  score: number;
  feedback?: string;
}

// Enhanced answer validation with better error handling
export const validateAnswer = (
  answer: Answer, 
  question: Question
): AnswerValidation => {
  try {
    if (!answer || !question) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Invalid answer or question data'
      };
    }

    switch (question.type) {
      case 'multiple-choice':
        return validateMultipleChoice(answer, question);
      case 'true-false':
        return validateTrueFalse(answer, question);
      case 'text-input':
        return validateTextInput(answer, question);
      case 'drag-drop':
        return validateDragDrop(answer, question);
      case 'sorting':
        return validateSorting(answer, question);
      default:
        return {
          isCorrect: false,
          score: 0,
          feedback: `Unsupported question type: ${(question as any).type}`
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    return {
      isCorrect: false,
      score: 0,
      feedback: `Validation error: ${errorMessage}`
    };
  }
};

// Enhanced multiple choice validation
const validateMultipleChoice = (answer: Answer, question: Question): AnswerValidation => {
  if (!question.options || !Array.isArray(question.options)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Invalid question options'
    };
  }

  const selectedOption = answer.value;
  const correctOption = question.options.find(option => option.isCorrect);

  if (!correctOption) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No correct option found in question'
    };
  }

  const isCorrect = selectedOption === correctOption.value;
  
  return {
    isCorrect,
    score: isCorrect ? question.points || 1 : 0,
    feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer was: ${correctOption.value}`
  };
};

// Enhanced true/false validation
const validateTrueFalse = (answer: Answer, question: Question): AnswerValidation => {
  const userAnswer = answer.value?.toLowerCase().trim();
  const correctAnswer = question.correctAnswer?.toLowerCase().trim();

  if (!correctAnswer) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No correct answer specified for question'
    };
  }

  const isCorrect = userAnswer === correctAnswer;
  
  return {
    isCorrect,
    score: isCorrect ? question.points || 1 : 0,
    feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer was: ${correctAnswer}`
  };
};

// Enhanced text input validation with fuzzy matching
const validateTextInput = (answer: Answer, question: Question): AnswerValidation => {
  const userAnswer = answer.value?.toLowerCase().trim();
  const correctAnswers = Array.isArray(question.correctAnswer) 
    ? question.correctAnswer.map(ans => ans.toLowerCase().trim())
    : [question.correctAnswer?.toLowerCase().trim()];

  if (!correctAnswers.length || correctAnswers.every(ans => !ans)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No correct answer specified for question'
    };
  }

  // Check for exact match first
  const exactMatch = correctAnswers.some(correct => correct === userAnswer);
  if (exactMatch) {
    return {
      isCorrect: true,
      score: question.points || 1,
      feedback: 'Correct!'
    };
  }

  // Check for partial match (for more flexible validation)
  const partialMatch = correctAnswers.some(correct => 
    userAnswer?.includes(correct) || correct?.includes(userAnswer || '')
  );

  if (partialMatch) {
    return {
      isCorrect: true,
      score: (question.points || 1) * 0.8, // Partial credit
      feedback: 'Partially correct!'
    };
  }

  return {
    isCorrect: false,
    score: 0,
    feedback: `Incorrect. Correct answers include: ${correctAnswers.join(', ')}`
  };
};

// Enhanced drag and drop validation
const validateDragDrop = (answer: Answer, question: Question): AnswerValidation => {
  if (!question.correctOrder || !Array.isArray(question.correctOrder)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No correct order specified for drag-drop question'
    };
  }

  const userOrder = Array.isArray(answer.value) ? answer.value : [];
  
  if (userOrder.length !== question.correctOrder.length) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Incomplete answer'
    };
  }

  // Check if all items are in correct positions
  const isFullyCorrect = userOrder.every((item, index) => 
    item === question.correctOrder[index]
  );

  if (isFullyCorrect) {
    return {
      isCorrect: true,
      score: question.points || 1,
      feedback: 'Correct! All items are in the right order.'
    };
  }

  // Calculate partial score based on correct positions
  const correctPositions = userOrder.reduce((count, item, index) => 
    count + (item === question.correctOrder[index] ? 1 : 0), 0
  );

  const partialScore = (question.points || 1) * (correctPositions / question.correctOrder.length);

  return {
    isCorrect: false,
    score: partialScore,
    feedback: `Partially correct. ${correctPositions} out of ${question.correctOrder.length} items are in the right position.`
  };
};

// Enhanced sorting validation
const validateSorting = (answer: Answer, question: Question): AnswerValidation => {
  if (!question.correctOrder || !Array.isArray(question.correctOrder)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No correct order specified for sorting question'
    };
  }

  const userOrder = Array.isArray(answer.value) ? answer.value : [];
  
  if (userOrder.length !== question.correctOrder.length) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Incomplete answer'
    };
  }

  // Check if all items are in correct positions
  const isFullyCorrect = userOrder.every((item, index) => 
    item === question.correctOrder[index]
  );

  if (isFullyCorrect) {
    return {
      isCorrect: true,
      score: question.points || 1,
      feedback: 'Correct! All items are in the right order.'
    };
  }

  // Calculate partial score based on correct positions
  const correctPositions = userOrder.reduce((count, item, index) => 
    count + (item === question.correctOrder[index] ? 1 : 0), 0
  );

  const partialScore = (question.points || 1) * (correctPositions / question.correctOrder.length);

  return {
    isCorrect: false,
    score: partialScore,
    feedback: `Partially correct. ${correctPositions} out of ${question.correctOrder.length} items are in the right position.`
  };
};

// Enhanced total score calculation
export const calculateTotalScore = (answers: Record<number, Answer>, questions: Question[]): number => {
  try {
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer) {
        const validation = validateAnswer(answer, question);
        totalScore += validation.score;
      }
      maxPossibleScore += question.points || 1;
    });

    return {
      totalScore,
      maxPossibleScore,
      percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
    };
  } catch (error) {
    console.error('Error calculating total score:', error);
    return {
      totalScore: 0,
      maxPossibleScore: 0,
      percentage: 0
    };
  }
};

// Enhanced validation for question data
export const validateQuestion = (question: Question): ValidationResult => {
  try {
    if (!question) {
      return {
        isValid: false,
        error: 'Question is required'
      };
    }

    if (!question.text || question.text.trim() === '') {
      return {
        isValid: false,
        error: 'Question text is required'
      };
    }

    if (!question.type) {
      return {
        isValid: false,
        error: 'Question type is required'
      };
    }

    // Validate based on question type
    switch (question.type) {
      case 'multiple-choice':
        if (!question.options || question.options.length < 2) {
          return {
            isValid: false,
            error: 'Multiple choice questions must have at least 2 options'
          };
        }
        if (!question.options.some(option => option.isCorrect)) {
          return {
            isValid: false,
            error: 'Multiple choice questions must have at least one correct option'
          };
        }
        break;

      case 'true-false':
        if (!question.correctAnswer) {
          return {
            isValid: false,
            error: 'True/false questions must have a correct answer'
          };
        }
        break;

      case 'text-input':
        if (!question.correctAnswer) {
          return {
            isValid: false,
            error: 'Text input questions must have a correct answer'
          };
        }
        break;

      case 'drag-drop':
      case 'sorting':
        if (!question.correctOrder || question.correctOrder.length < 2) {
          return {
            isValid: false,
            error: 'Drag-drop and sorting questions must have at least 2 items in correct order'
          };
        }
        break;

      default:
        return {
          isValid: false,
          error: `Unsupported question type: ${(question as any).type}`
        };
    }

    return {
      isValid: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    return {
      isValid: false,
      error: `Question validation error: ${errorMessage}`
    };
  }
};

// Enhanced validation for quiz data
export const validateQuiz = (questions: Question[]): ValidationResult => {
  try {
    if (!Array.isArray(questions)) {
      return {
        isValid: false,
        error: 'Questions must be an array'
      };
    }

    if (questions.length === 0) {
      return {
        isValid: false,
        error: 'Quiz must have at least one question'
      };
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const validation = validateQuestion(question);
      
      if (!validation.isValid) {
        return {
          isValid: false,
          error: `Question ${i + 1}: ${validation.error}`
        };
      }
    }

    return {
      isValid: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    return {
      isValid: false,
      error: `Quiz validation error: ${errorMessage}`
    };
  }
}; 