import { create } from "zustand";

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  isQuizActive: boolean;
  quizId: string | null;
  studentId: string | null;
}

interface QuizActions {
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestion: (question: number) => void;
  startQuiz: (quizId: string, studentId: string) => void;
  resetQuiz: () => void;
  getAnswer: (questionId: number) => string | undefined;
  getProgress: () => number;
}

type QuizStore = QuizState & QuizActions;

export const useQuizStore = create<QuizStore>((set, get) => ({
  // State
  currentQuestion: 0,
  answers: {},
  isQuizActive: false,
  quizId: null,
  studentId: null,

  // Actions
  setAnswer: (questionId, answer) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    })),

  setCurrentQuestion: (question) => 
    set({ currentQuestion: question }),

  startQuiz: (quizId, studentId) => 
    set({ 
      isQuizActive: true, 
      quizId, 
      studentId,
      currentQuestion: 0,
      answers: {}
    }),

  resetQuiz: () => 
    set({ 
      isQuizActive: false, 
      quizId: null, 
      studentId: null,
      currentQuestion: 0,
      answers: {}
    }),

  getAnswer: (questionId) => get().answers[questionId],

  getProgress: () => {
    const state = get();
    const answeredQuestions = Object.keys(state.answers).length;
    return answeredQuestions;
  },
})); 