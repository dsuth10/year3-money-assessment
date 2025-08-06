import { useQuizStore } from './quizStore';
import { useStudentStore } from './studentStore';
import type { QuestionState, QuestionStatus } from '../types/questions';

// Enhanced selectors with latest Zustand v5 patterns and better performance
export const useQuizSelectors = () => {
  // Core quiz state selectors with memoization
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const answers = useQuizStore((state) => state.answers);
  const questionStates = useQuizStore((state) => state.questionStates);
  const isQuizActive = useQuizStore((state) => state.isQuizActive);
  const quizId = useQuizStore((state) => state.quizId);
  const studentId = useQuizStore((state) => state.studentId);
  const isLoading = useQuizStore((state) => state.isLoading);
  const error = useQuizStore((state) => state.error);

  // Computed selectors for better performance
  const progress = useQuizStore((state) => {
    const answeredCount = Object.keys(state.answers).length;
    return {
      answered: answeredCount,
      total: 22, // Fixed total for now
      percentage: 22 > 0 ? (answeredCount / 22) * 100 : 0,
      remaining: 22 - answeredCount
    };
  });

  const currentAnswer = useQuizStore((state) => 
    state.answers[state.currentQuestion] || null
  );

  const currentQuestionState = useQuizStore((state) => 
    state.questionStates[state.currentQuestion] || { status: 'pending' as QuestionStatus }
  );

  const isCurrentQuestionAnswered = useQuizStore((state) => 
    state.currentQuestion in state.answers
  );

  const canNavigateNext = useQuizStore((state) => 
    state.currentQuestion < 21 // Fixed total - 1
  );

  const canNavigatePrevious = useQuizStore((state) => 
    state.currentQuestion > 0
  );

  const isQuizComplete = useQuizStore((state) => 
    Object.keys(state.answers).length === 22 // Fixed total
  );

  const score = useQuizStore((state) => {
    const correctAnswers = Object.keys(state.answers).length; // Simplified for now
    return {
      correct: correctAnswers,
      total: 22, // Fixed total
      percentage: 22 > 0 ? (correctAnswers / 22) * 100 : 0
    };
  });

  const questionProgress = useQuizStore((state) => {
    const progress: any[] = [];
    for (let i = 0; i < 22; i++) { // Fixed total
      const answer = state.answers[i];
      const questionState = state.questionStates[i];
      progress.push({
        questionIndex: i,
        isAnswered: !!answer,
        isCorrect: !!answer, // Simplified for now
        status: questionState?.status || 'pending',
        hasError: false // Simplified for now
      });
    }
    return progress;
  });

  const unansweredQuestions = useQuizStore((state) => {
    const unanswered: number[] = [];
    for (let i = 0; i < 22; i++) { // Fixed total
      if (!(i in state.answers)) {
        unanswered.push(i);
      }
    }
    return unanswered;
  });

  const correctAnswers = useQuizStore((state) => {
    const correct: number[] = [];
    Object.keys(state.answers).forEach((index) => {
      correct.push(parseInt(index));
    });
    return correct;
  });

  const incorrectAnswers = useQuizStore((state) => {
    return []; // Simplified for now
  });

  // Student-related selectors
  const currentStudent = useStudentStore((state) => state.currentStudent);
  const students = useStudentStore((state) => state.students);
  const studentLoading = useStudentStore((state) => state.isLoading);
  const studentError = useStudentStore((state) => state.error);

  // Combined selectors for complex state
  const quizStatus = useQuizStore((state) => {
    if (!state.isQuizActive) return 'inactive';
    if (state.isLoading) return 'loading';
    if (state.error) return 'error';
    if (Object.keys(state.answers).length === 22) return 'complete'; // Fixed total
    return 'active';
  });

  const navigationState = useQuizStore((state) => ({
    canGoNext: state.currentQuestion < 21, // Fixed total - 1
    canGoPrevious: state.currentQuestion > 0,
    canFinish: Object.keys(state.answers).length === 22, // Fixed total
    currentStep: state.currentQuestion + 1,
    totalSteps: 22 // Fixed total
  }));

  const validationState = useQuizStore((state) => {
    const currentAnswer = state.answers[state.currentQuestion];
    const currentState = state.questionStates[state.currentQuestion];
    
    return {
      hasAnswer: !!currentAnswer,
      isCorrect: !!currentAnswer, // Simplified for now
      hasError: false, // Simplified for now
      errorMessage: null, // Simplified for now
      isValid: !!currentAnswer
    };
  });

  return {
    // Core state
    currentQuestion,
    answers,
    questionStates,
    isQuizActive,
    quizId,
    studentId,
    isLoading,
    error,
    
    // Computed state
    progress,
    currentAnswer,
    currentQuestionState,
    isCurrentQuestionAnswered,
    canNavigateNext,
    canNavigatePrevious,
    isQuizComplete,
    score,
    questionProgress,
    unansweredQuestions,
    correctAnswers,
    incorrectAnswers,
    
    // Student state
    currentStudent,
    students,
    studentLoading,
    studentError,
    
    // Combined state
    quizStatus,
    navigationState,
    validationState
  };
};

// Specialized selectors for specific use cases
export const useQuizProgress = () => {
  return useQuizStore((state) => {
    const answeredCount = Object.keys(state.answers).length;
    return {
      answered: answeredCount,
      total: 22, // Fixed total
      percentage: 22 > 0 ? (answeredCount / 22) * 100 : 0,
      remaining: 22 - answeredCount
    };
  });
};

export const useQuizScore = () => {
  return useQuizStore((state) => {
    const correctAnswers = Object.keys(state.answers).length; // Simplified for now
    return {
      correct: correctAnswers,
      total: 22, // Fixed total
      percentage: 22 > 0 ? (correctAnswers / 22) * 100 : 0
    };
  });
};

export const useCurrentQuestion = () => {
  return useQuizStore((state) => ({
    index: state.currentQuestion,
    answer: state.answers[state.currentQuestion] || null,
    state: state.questionStates[state.currentQuestion] || { status: 'pending' as QuestionStatus },
    isAnswered: state.currentQuestion in state.answers,
    isCorrect: state.currentQuestion in state.answers // Simplified for now
  }));
};

export const useQuestionStatus = (questionId: number) => {
  return useQuizStore((state) => 
    state.questionStates[questionId]?.status || 'pending'
  );
};

export const useQuestionsByStatus = (status: QuestionStatus) => {
  return useQuizStore((state) => {
    const questions: number[] = [];
    Object.entries(state.questionStates).forEach(([id, state]) => {
      if (state.status === status) {
        questions.push(parseInt(id));
      }
    });
    return questions;
  });
};

export const useCanSkipCurrentQuestion = () => {
  return useQuizStore((state) => {
    // Allow skipping if quiz is active and question is not answered
    return state.isQuizActive && !(state.currentQuestion in state.answers);
  });
};

export const useCanSubmitCurrentQuestion = () => {
  return useQuizStore((state) => {
    // Allow submitting if quiz is active and question has an answer
    return state.isQuizActive && (state.currentQuestion in state.answers);
  });
};

export const useCompletionPercentage = () => {
  return useQuizStore((state) => {
    const answeredCount = Object.keys(state.answers).length;
    return 22 > 0 ? (answeredCount / 22) * 100 : 0; // Fixed total
  });
};

export const useQuestionAnswer = (questionId: number) => {
  return useQuizStore((state) => 
    state.answers[questionId] || null
  );
};

export const useQuizActive = () => {
  return useQuizStore((state) => state.isQuizActive);
};

export const useQuizCompleted = () => {
  return useQuizStore((state) => 
    Object.keys(state.answers).length === 22 // Fixed total
  );
};

export const useQuizError = () => {
  return useQuizStore((state) => state.error);
};

export const useQuizLoading = () => {
  return useQuizStore((state) => state.isLoading);
};

export const useTotalScore = () => {
  return useQuizStore((state) => state.totalScore);
};

export const useQuizNavigation = () => {
  return useQuizStore((state) => ({
    canGoNext: state.currentQuestion < 21, // Fixed total - 1
    canGoPrevious: state.currentQuestion > 0,
    canFinish: Object.keys(state.answers).length === 22, // Fixed total
    currentStep: state.currentQuestion + 1,
    totalSteps: 22 // Fixed total
  }));
}; 