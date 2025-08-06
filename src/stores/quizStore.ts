import { create } from "zustand";
import { dbUtils, type StudentAttempt, type Answer } from "../db/database";
import { validateAnswer, calculateTotalScore } from "../utils/validation";

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  isQuizActive: boolean;
  quizId: string | null;
  studentId: string | null;
  currentAttemptId: number | null;
  isLoading: boolean;
  error: string | null;
  validationResults: Record<number, any>;
  totalScore: number;
}

interface QuizActions {
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestion: (question: number) => void;
  startQuiz: (quizId: string, studentId: string) => Promise<void>;
  resetQuiz: () => void;
  getAnswer: (questionId: number) => string | undefined;
  getProgress: () => number;
  saveAnswer: (questionId: number, answer: string) => Promise<void>;
  validateAnswer: (questionId: number, answer: any) => any;
  completeQuiz: () => Promise<void>;
  loadAttempt: (attemptId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
}

type QuizStore = QuizState & QuizActions;

export const useQuizStore = create<QuizStore>((set, get) => ({
  // State
  currentQuestion: 0,
  answers: {},
  isQuizActive: false,
  quizId: null,
  studentId: null,
  currentAttemptId: null,
  isLoading: false,
  error: null,
  validationResults: {},
  totalScore: 0,

  // Actions
  setAnswer: (questionId, answer) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    })),

  setCurrentQuestion: (question) => 
    set({ currentQuestion: question }),

  startQuiz: async (quizId, studentId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create a new attempt in the database
      const attemptId = await dbUtils.createAttempt({
        studentId,
        quizId,
        timestamp: Date.now(),
        completed: false
      });
      
      set({ 
        isQuizActive: true, 
        quizId, 
        studentId,
        currentAttemptId: attemptId,
        currentQuestion: 0,
        answers: {},
        validationResults: {},
        totalScore: 0
      });
    } catch (error) {
      set({ error: `Failed to start quiz: ${error}` });
      console.error('Error starting quiz:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetQuiz: () => 
    set({ 
      isQuizActive: false, 
      quizId: null, 
      studentId: null,
      currentAttemptId: null,
      currentQuestion: 0,
      answers: {},
      validationResults: {},
      totalScore: 0,
      error: null
    }),

  getAnswer: (questionId) => get().answers[questionId],

  getProgress: () => {
    const state = get();
    const answeredQuestions = Object.keys(state.answers).length;
    return answeredQuestions;
  },

  saveAnswer: async (questionId, answer) => {
    try {
      const state = get();
      if (!state.currentAttemptId) {
        throw new Error('No active attempt');
      }

      set({ isLoading: true, error: null });

      // Save answer to database
      await dbUtils.saveAnswer({
        attemptId: state.currentAttemptId,
        questionId,
        answer
      });

      // Update local state
      set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      }));
    } catch (error) {
      set({ error: `Failed to save answer: ${error}` });
      console.error('Error saving answer:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  validateAnswer: (questionId, answer) => {
    try {
      const result = validateAnswer(questionId, answer);
      
      // Store validation result
      set((state) => ({
        validationResults: { ...state.validationResults, [questionId]: result }
      }));

      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isCorrect: false,
        feedback: 'An error occurred during validation.',
        score: 0
      };
    }
  },

  calculateScore: () => {
    const state = get();
    const score = calculateTotalScore(state.answers);
    set({ totalScore: score });
    return score;
  },

  completeQuiz: async () => {
    try {
      const state = get();
      if (!state.currentAttemptId) {
        throw new Error('No active attempt');
      }

      set({ isLoading: true, error: null });

      // Calculate final score
      const finalScore = state.calculateScore();

      // Update attempt as completed
      await dbUtils.updateAttempt(state.currentAttemptId, {
        completed: true,
        score: finalScore
      });

      // Reset quiz state
      set({ 
        isQuizActive: false, 
        quizId: null, 
        studentId: null,
        currentAttemptId: null,
        currentQuestion: 0,
        answers: {},
        validationResults: {},
        totalScore: 0
      });
    } catch (error) {
      set({ error: `Failed to complete quiz: ${error}` });
      console.error('Error completing quiz:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadAttempt: async (attemptId) => {
    try {
      set({ isLoading: true, error: null });
      
      const attemptWithAnswers = await dbUtils.getAttemptWithAnswers(attemptId);
      if (attemptWithAnswers) {
        const { attempt, answers } = attemptWithAnswers;
        
        // Convert answers array to Record format
        const answersRecord: Record<number, string> = {};
        const validationResults: Record<number, any> = {};
        
        answers.forEach(answer => {
          answersRecord[answer.questionId] = answer.answer;
          
          // Validate the answer and store result
          try {
            const parsedAnswer = JSON.parse(answer.answer);
            const validationResult = validateAnswer(answer.questionId, parsedAnswer);
            validationResults[answer.questionId] = validationResult;
          } catch (error) {
            console.error(`Error validating loaded answer for question ${answer.questionId}:`, error);
          }
        });

        const totalScore = calculateTotalScore(answersRecord);

        set({
          quizId: attempt.quizId,
          studentId: attempt.studentId,
          currentAttemptId: attempt.id || null,
          isQuizActive: !attempt.completed,
          answers: answersRecord,
          validationResults,
          totalScore,
          currentQuestion: 0
        });
      } else {
        set({ error: `Attempt with id ${attemptId} not found` });
      }
    } catch (error) {
      set({ error: `Failed to load attempt: ${error}` });
      console.error('Error loading attempt:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading) => 
    set({ isLoading: loading }),

  setError: (error) => 
    set({ error }),
})); 