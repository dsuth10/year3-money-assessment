import { useQuizStore } from './quizStore';
import { useStudentStore } from './studentStore';
import { dbUtils, type Student, type Answer } from '../db/database';

// Persistence utilities for Zustand stores
export const persistenceUtils = {
  // Quiz store persistence
  async saveQuizStateToDB(attemptId: number): Promise<void> {
    const quizState = useQuizStore.getState();
    
    if (!quizState.isQuizActive || !quizState.quizId || !quizState.studentId) {
      return;
    }

    // Save answers to database
    const answers: Omit<Answer, 'id'>[] = Object.entries(quizState.answers).map(([questionId, answer]) => ({
      attemptId,
      questionId: parseInt(questionId),
      answer,
    }));

    // Save all answers in a transaction
    await db.transaction('rw', [db.answers], async () => {
      for (const answer of answers) {
        await dbUtils.saveAnswer(answer);
      }
    });
  },

  async loadQuizStateFromDB(attemptId: number): Promise<void> {
    try {
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      const attempt = await dbUtils.getAttemptById(attemptId);

      if (attempt && answers.length > 0) {
        const answersMap: Record<number, string> = {};
        answers.forEach(answer => {
          answersMap[answer.questionId] = answer.answer;
        });

        useQuizStore.setState({
          answers: answersMap,
          currentQuestion: answers.length,
          isQuizActive: true,
          quizId: attempt.quizId,
          studentId: attempt.studentId,
        });
      }
    } catch (error) {
      console.error('Failed to load quiz state from database:', error);
    }
  },

  // Student store persistence
  async saveStudentsToDB(): Promise<void> {
    const studentState = useStudentStore.getState();
    
    try {
      await db.transaction('rw', [db.students], async () => {
        for (const student of studentState.students) {
          await dbUtils.addStudent(student);
        }
      });
    } catch (error) {
      console.error('Failed to save students to database:', error);
    }
  },

  async loadStudentsFromDB(): Promise<void> {
    try {
      const students = await dbUtils.getAllStudents();
      useStudentStore.setState({ students, isLoading: false });
    } catch (error) {
      console.error('Failed to load students from database:', error);
      useStudentStore.setState({ isLoading: false });
    }
  },

  // Initialize database with sample data
  async initializeDatabase(): Promise<void> {
    try {
      // Check if database is empty
      const stats = await dbUtils.getDatabaseStats();
      
      if (stats.students === 0) {
        // Add sample students
        const sampleStudents: Omit<Student, 'totalAttempts'>[] = [
          { id: 'student1', name: 'Alice Johnson', grade: 'Year 3' },
          { id: 'student2', name: 'Bob Smith', grade: 'Year 3' },
          { id: 'student3', name: 'Charlie Brown', grade: 'Year 3' },
        ];

        await db.transaction('rw', [db.students], async () => {
          for (const student of sampleStudents) {
            await dbUtils.addStudent(student);
          }
        });

        // Load students into Zustand store
        await this.loadStudentsFromDB();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  },

  // Sync Zustand state with database
  async syncStateWithDatabase(): Promise<void> {
    try {
      // Load students from database
      await this.loadStudentsFromDB();
      
      // Check for active quiz attempts
      const quizState = useQuizStore.getState();
      if (quizState.isQuizActive && quizState.studentId) {
        const attempts = await dbUtils.getAttemptsByStudent(quizState.studentId);
        const activeAttempt = attempts.find(attempt => 
          attempt.quizId === quizState.quizId && !attempt.completed
        );
        
        if (activeAttempt) {
          await this.loadQuizStateFromDB(activeAttempt.id!);
        }
      }
    } catch (error) {
      console.error('Failed to sync state with database:', error);
    }
  },
};

// Import db for use in persistence utilities
import { db } from '../db/database'; 