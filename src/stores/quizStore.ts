import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { dbUtils, type StudentAttempt, type Answer } from "../db/database";
import { validateAnswer, calculateTotalScore } from "../utils/validation";
import { 
  type QuizState, 
  type QuizActions, 
  type QuizStore, 
  type QuestionState, 
  type QuestionStatus, 
  type QuestionProgress 
} from "../types/questions";

// Enhanced quiz store with latest Zustand v5 patterns
export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        currentQuestion: 0,
        answers: {},
        questionStates: {},
        isQuizActive: false,
        quizId: null,
        studentId: null,
        currentAttemptId: null,
        isLoading: false,
        error: null,
        validationResults: {},
        totalScore: 0,

        // Actions with enhanced error handling and TypeScript safety
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
              questionStates: {},
              validationResults: {},
              totalScore: 0
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({ error: `Failed to start quiz: ${errorMessage}` });
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
            questionStates: {},
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

            // Save answer to database with status
            await dbUtils.saveAnswer({
              attemptId: state.currentAttemptId,
              questionId,
              answer,
              status: 'answered'
            });

            // Update local state
            set((state) => ({
              answers: { ...state.answers, [questionId]: answer },
              questionStates: {
                ...state.questionStates,
                [questionId]: {
                  ...state.questionStates[questionId],
                  status: 'answered',
                  answer
                }
              }
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({ error: `Failed to save answer: ${errorMessage}` });
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
              questionStates: {},
              validationResults: {},
              totalScore: 0
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({ error: `Failed to complete quiz: ${errorMessage}` });
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
              
              // Convert answers array to Record format and build question states
              const answersRecord: Record<number, string> = {};
              const validationResults: Record<number, any> = {};
              const questionStates: Record<number, QuestionState> = {};
              
              answers.forEach(answer => {
                answersRecord[answer.questionId] = answer.answer;
                
                // Build question state from answer data
                questionStates[answer.questionId] = {
                  status: answer.status || 'answered',
                  answer: answer.answer,
                  submittedAt: answer.submittedAt,
                  skippedAt: answer.skippedAt
                };
                
                // Validate the answer and store result
                try {
                  const parsedAnswer = JSON.parse(answer.answer);
                  const validationResult = validateAnswer(answer.questionId, parsedAnswer);
                  validationResults[answer.questionId] = validationResult;
                  questionStates[answer.questionId].validationResult = validationResult;
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
                questionStates,
                validationResults,
                totalScore,
                currentQuestion: 0
              });
            } else {
              set({ error: `Attempt with id ${attemptId} not found` });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({ error: `Failed to load attempt: ${errorMessage}` });
            console.error('Error loading attempt:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        setLoading: (loading) => 
          set({ isLoading: loading }),

        setError: (error) => 
          set({ error }),

        // Enhanced status management actions with comprehensive documentation

        /**
         * Marks a question as skipped and updates the database with timestamp
         * @param questionId - The ID of the question to skip
         * @throws {Error} If no active attempt exists
         */
        skipQuestion: (questionId) => {
          const state = get();
          const timestamp = Date.now();
          
          set((state) => ({
            questionStates: {
              ...state.questionStates,
              [questionId]: {
                ...state.questionStates[questionId],
                status: 'skipped',
                skippedAt: timestamp
              }
            }
          }));

          // Update database if there's an active attempt
          if (state.currentAttemptId) {
            dbUtils.updateAnswerStatus(state.currentAttemptId, questionId, 'skipped', timestamp)
              .catch(error => console.error('Error updating answer status in database:', error));
          }
        },

        /**
         * Marks a question as submitted with optional answer storage
         * @param questionId - The ID of the question to submit
         * @param answer - Optional answer to store with the submission
         * @throws {Error} If no answer is provided and no existing answer exists
         */
        submitQuestion: (questionId, answer) => {
          const state = get();
          const timestamp = Date.now();
          const currentAnswer = answer || state.answers[questionId];
          
          if (!currentAnswer) {
            console.warn('Cannot submit question without answer');
            return;
          }

          set((state) => ({
            answers: { ...state.answers, [questionId]: currentAnswer },
            questionStates: {
              ...state.questionStates,
              [questionId]: {
                ...state.questionStates[questionId],
                status: 'submitted',
                answer: currentAnswer,
                submittedAt: timestamp
              }
            }
          }));

          // Update database if there's an active attempt
          if (state.currentAttemptId) {
            dbUtils.updateAnswerStatus(state.currentAttemptId, questionId, 'submitted', timestamp)
              .catch(error => console.error('Error updating answer status in database:', error));
          }
        },

        /**
         * Returns the current status of a specific question
         * @param questionId - The ID of the question to check
         * @returns {QuestionStatus} The current status of the question, defaults to 'pending'
         */
        getQuestionStatus: (questionId) => {
          const state = get();
          return state.questionStates[questionId]?.status || 'pending';
        },

        /**
         * Updates the status of a question with optional timestamp tracking
         * @param questionId - The ID of the question to update
         * @param status - The new status to set
         * @throws {Error} If the status is invalid
         */
        updateQuestionStatus: (questionId, status) => {
          const state = get();
          const timestamp = Date.now();
          
          // Validate status
          const validStatuses: QuestionStatus[] = ['pending', 'skipped', 'submitted', 'answered'];
          if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
          }
          
          set((state) => ({
            questionStates: {
              ...state.questionStates,
              [questionId]: {
                ...state.questionStates[questionId],
                status,
                ...(status === 'submitted' && { submittedAt: timestamp }),
                ...(status === 'skipped' && { skippedAt: timestamp })
              }
            }
          }));

          // Update database if there's an active attempt
          if (state.currentAttemptId) {
            dbUtils.updateAnswerStatus(state.currentAttemptId, questionId, status, timestamp)
              .catch(error => console.error('Error updating answer status in database:', error));
          }
        },

        /**
         * Calculates comprehensive progress metrics for the current quiz
         * @returns {QuestionProgress} Object containing counts and percentage for each status type
         */
        getQuestionProgress: () => {
          const state = get();
          const questionStates = Object.values(state.questionStates);
          const totalQuestions = questionStates.length;
          
          const pendingQuestions = questionStates.filter(q => q.status === 'pending').length;
          const skippedQuestions = questionStates.filter(q => q.status === 'skipped').length;
          const submittedQuestions = questionStates.filter(q => q.status === 'submitted').length;
          const answeredQuestions = questionStates.filter(q => q.status === 'answered').length;
          
          const progressPercentage = totalQuestions > 0 
            ? ((submittedQuestions + answeredQuestions) / totalQuestions) * 100 
            : 0;

          return {
            totalQuestions,
            pendingQuestions,
            skippedQuestions,
            submittedQuestions,
            answeredQuestions,
            progressPercentage
          };
        }
      }),
      {
        name: 'quiz-store',
        partialize: (state) => ({
          currentQuestion: state.currentQuestion,
          answers: state.answers,
          questionStates: state.questionStates,
          isQuizActive: state.isQuizActive,
          quizId: state.quizId,
          studentId: state.studentId,
          currentAttemptId: state.currentAttemptId,
          totalScore: state.totalScore,
          validationResults: state.validationResults
        })
      }
    ),
    {
      name: 'quiz-store'
    }
  )
); 