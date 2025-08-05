import Dexie, { type Table } from "dexie";

// Database interfaces
export interface StudentAttempt {
  id?: number;
  studentId: string;
  quizId: string;
  timestamp: number;
  completed: boolean;
  score?: number;
}

export interface Answer {
  id?: number;
  attemptId: number;
  questionId: number;
  answer: string;
  isCorrect?: boolean;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  lastAttempt?: Date;
  totalAttempts: number;
}

export interface QuizData {
  id: string;
  title: string;
  questions: Question[];
  totalQuestions: number;
}

export interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'drag-drop' | 'text';
  options?: string[];
  correctAnswer: string;
  currencyAmount?: number;
}

// Database class
export class QuizDatabase extends Dexie {
  studentAttempts!: Table<StudentAttempt, number>;
  answers!: Table<Answer, number>;
  students!: Table<Student, string>;
  quizData!: Table<QuizData, string>;

  constructor() {
    super("QuizDatabase");
    
    this.version(1).stores({
      studentAttempts: "++id, studentId, quizId, timestamp, completed",
      answers: "++id, attemptId, questionId",
      students: "id, name, grade",
      quizData: "id, title, totalQuestions",
    });
  }
}

// Export singleton instance
export const db = new QuizDatabase();

// Database utility functions
export const dbUtils = {
  // Student management
  async addStudent(student: Omit<Student, 'totalAttempts'>): Promise<string> {
    const studentWithDefaults = { ...student, totalAttempts: 0 };
    await db.students.put(studentWithDefaults);
    return student.id;
  },

  async getStudent(id: string): Promise<Student | undefined> {
    return await db.students.get(id);
  },

  async getAllStudents(): Promise<Student[]> {
    return await db.students.toArray();
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    await db.students.update(id, updates);
  },

  // Quiz attempts
  async createAttempt(attempt: Omit<StudentAttempt, 'id'>): Promise<number> {
    return await db.studentAttempts.add(attempt);
  },

  async getAttemptsByStudent(studentId: string): Promise<StudentAttempt[]> {
    return await db.studentAttempts.where('studentId').equals(studentId).toArray();
  },

  async getAttemptById(attemptId: number): Promise<StudentAttempt | undefined> {
    return await db.studentAttempts.get(attemptId);
  },

  async updateAttempt(attemptId: number, updates: Partial<StudentAttempt>): Promise<void> {
    await db.studentAttempts.update(attemptId, updates);
  },

  // Answers
  async saveAnswer(answer: Omit<Answer, 'id'>): Promise<number> {
    return await db.answers.add(answer);
  },

  async getAnswersByAttempt(attemptId: number): Promise<Answer[]> {
    return await db.answers.where('attemptId').equals(attemptId).toArray();
  },

  // Quiz data
  async saveQuizData(quizData: QuizData): Promise<string> {
    await db.quizData.put(quizData);
    return quizData.id;
  },

  async getQuizData(quizId: string): Promise<QuizData | undefined> {
    return await db.quizData.get(quizId);
  },

  // Utility functions
  async clearAllData(): Promise<void> {
    await db.transaction('rw', [db.students, db.studentAttempts, db.answers, db.quizData], async () => {
      await db.students.clear();
      await db.studentAttempts.clear();
      await db.answers.clear();
      await db.quizData.clear();
    });
  },

  async getDatabaseStats(): Promise<{
    students: number;
    attempts: number;
    answers: number;
    quizzes: number;
  }> {
    const [students, attempts, answers, quizzes] = await Promise.all([
      db.students.count(),
      db.studentAttempts.count(),
      db.answers.count(),
      db.quizData.count(),
    ]);

    return { students, attempts, answers, quizzes };
  },
}; 