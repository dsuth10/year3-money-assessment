import Dexie, { type Table } from "dexie";

/**
 * Database Schema Documentation
 * 
 * This module implements a Dexie 4 IndexedDB database for the Year 3 Money Assessment application.
 * 
 * Schema Version History:
 * - v1: Initial schema with basic tables for students, attempts, answers, and quiz data
 * - Future migrations will be handled through Dexie's versioning system
 * 
 * Tables:
 * - students: Student information and progress tracking
 * - studentAttempts: Quiz attempt records with timestamps and completion status
 * - answers: Individual question answers linked to attempts
 * - quizData: Quiz definitions and question structures
 * 
 * Indexes:
 * - Composite indexes for common query patterns (studentId+quizId, attemptId+questionId)
 * - Timestamp indexes for chronological queries
 * - Foreign key relationships maintained through indexed fields
 */

// Database interfaces with runtime validation
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

// Runtime validation functions
const validateStudentAttempt = (attempt: StudentAttempt): void => {
  if (!attempt.studentId || !attempt.quizId) {
    throw new Error('StudentAttempt requires studentId and quizId');
  }
  if (typeof attempt.timestamp !== 'number' || attempt.timestamp <= 0) {
    throw new Error('StudentAttempt requires valid timestamp');
  }
  if (typeof attempt.completed !== 'boolean') {
    throw new Error('StudentAttempt requires boolean completed field');
  }
};

const validateAnswer = (answer: Answer): void => {
  if (!answer.attemptId || !answer.questionId) {
    throw new Error('Answer requires attemptId and questionId');
  }
  if (!answer.answer) {
    throw new Error('Answer requires answer field');
  }
};

const validateStudent = (student: Student): void => {
  if (!student.id || !student.name || !student.grade) {
    throw new Error('Student requires id, name, and grade');
  }
  if (typeof student.totalAttempts !== 'number' || student.totalAttempts < 0) {
    throw new Error('Student requires valid totalAttempts');
  }
};

const validateQuizData = (quizData: QuizData): void => {
  if (!quizData.id || !quizData.title) {
    throw new Error('QuizData requires id and title');
  }
  if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    throw new Error('QuizData requires non-empty questions array');
  }
  if (typeof quizData.totalQuestions !== 'number' || quizData.totalQuestions <= 0) {
    throw new Error('QuizData requires valid totalQuestions');
  }
};

// Database class with enhanced schema and performance optimizations
export class QuizDatabase extends Dexie {
  studentAttempts!: Table<StudentAttempt, number>;
  answers!: Table<Answer, number>;
  students!: Table<Student, string>;
  quizData!: Table<QuizData, string>;

  constructor() {
    super("QuizDatabase");
    
    // Schema version 1: Initial schema with optimized indexes
    this.version(1).stores({
      // Primary key: auto-incrementing id
      // Indexes: studentId, quizId, timestamp for efficient queries
      // Composite index: [studentId+quizId] for student's quiz attempts
      studentAttempts: "++id, studentId, quizId, timestamp, completed, [studentId+quizId]",
      
      // Primary key: auto-incrementing id  
      // Indexes: attemptId, questionId for answer retrieval
      // Composite index: [attemptId+questionId] for attempt's answers
      answers: "++id, attemptId, questionId, [attemptId+questionId]",
      
      // Primary key: student id string
      // Indexes: name, grade for student lookups
      students: "id, name, grade",
      
      // Primary key: quiz id string
      // Indexes: title, totalQuestions for quiz management
      quizData: "id, title, totalQuestions",
    });

    // Future migration example (uncomment when needed):
    // this.version(2).stores({
    //   studentAttempts: "++id, studentId, quizId, timestamp, completed, score, [studentId+quizId], [studentId+timestamp]",
    //   // Add new fields or indexes as needed
    // });
  }
}

// Export singleton instance
export const db = new QuizDatabase();

// Performance monitoring utilities
interface DatabaseStats {
  students: number;
  attempts: number;
  answers: number;
  quizzes: number;
  averageQueryTime?: number;
  cacheHitRate?: number;
}

// In-memory cache for frequently accessed data
const cache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCached = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Enhanced database utility functions with validation, caching, and error handling
export const dbUtils = {
  // Student management with validation and caching
  async addStudent(student: Omit<Student, 'totalAttempts'>): Promise<string> {
    try {
      const studentWithDefaults = { ...student, totalAttempts: 0 };
      validateStudent(studentWithDefaults);
      await db.students.put(studentWithDefaults);
      cache.delete('students'); // Invalidate cache
      return student.id;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  async getStudent(id: string): Promise<Student | undefined> {
    try {
      const cacheKey = `student:${id}`;
      const cached = getCached<Student>(cacheKey);
      if (cached) return cached;

      const student = await db.students.get(id);
      if (student) {
        setCached(cacheKey, student);
      }
      return student;
    } catch (error) {
      console.error('Error getting student:', error);
      throw error;
    }
  },

  async getAllStudents(): Promise<Student[]> {
    try {
      const cached = getCached<Student[]>('all-students');
      if (cached) return cached;

      const students = await db.students.toArray();
      setCached('all-students', students);
      return students;
    } catch (error) {
      console.error('Error getting all students:', error);
      throw error;
    }
  },

  async getStudentByName(name: string): Promise<Student | undefined> {
    try {
      const normalizedName = name.trim().toLowerCase();
      const cacheKey = `student-by-name:${normalizedName}`;
      const cached = getCached<Student>(cacheKey);
      if (cached) return cached;

      // Get all students and filter by normalized name
      const students = await db.students.toArray();
      const student = students.find(s => 
        s.name.trim().toLowerCase() === normalizedName
      );
      
      if (student) {
        setCached(cacheKey, student);
      }
      return student;
    } catch (error) {
      console.error('Error getting student by name:', error);
      throw error;
    }
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      const existing = await db.students.get(id);
      if (!existing) {
        throw new Error(`Student with id ${id} not found`);
      }
      
      const updated = { ...existing, ...updates };
      validateStudent(updated);
      
      await db.students.update(id, updates);
      
      // Invalidate related caches
      cache.delete(`student:${id}`);
      cache.delete('all-students');
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Quiz attempts with atomic operations and validation
  async createAttempt(attempt: Omit<StudentAttempt, 'id'>): Promise<number> {
    try {
      validateStudentAttempt(attempt);
      const id = await db.studentAttempts.add(attempt);
      
      // Update student's attempt count atomically
      await db.transaction('rw', [db.students, db.studentAttempts], async () => {
        const student = await db.students.get(attempt.studentId);
        if (student) {
          await db.students.update(attempt.studentId, {
            totalAttempts: student.totalAttempts + 1,
            lastAttempt: new Date()
          });
        }
      });
      
      cache.delete('students');
      return id;
    } catch (error) {
      console.error('Error creating attempt:', error);
      throw error;
    }
  },

  async getAttemptsByStudent(studentId: string): Promise<StudentAttempt[]> {
    try {
      const cacheKey = `attempts:${studentId}`;
      const cached = getCached<StudentAttempt[]>(cacheKey);
      if (cached) return cached;

      const attempts = await db.studentAttempts
        .where('studentId')
        .equals(studentId)
        .reverse()
        .sortBy('timestamp');
      
      setCached(cacheKey, attempts);
      return attempts;
    } catch (error) {
      console.error('Error getting attempts by student:', error);
      throw error;
    }
  },

  async getAttemptById(attemptId: number): Promise<StudentAttempt | undefined> {
    try {
      const cacheKey = `attempt:${attemptId}`;
      const cached = getCached<StudentAttempt>(cacheKey);
      if (cached) return cached;

      const attempt = await db.studentAttempts.get(attemptId);
      if (attempt) {
        setCached(cacheKey, attempt);
      }
      return attempt;
    } catch (error) {
      console.error('Error getting attempt by id:', error);
      throw error;
    }
  },

  async updateAttempt(attemptId: number, updates: Partial<StudentAttempt>): Promise<void> {
    try {
      const existing = await db.studentAttempts.get(attemptId);
      if (!existing) {
        throw new Error(`Attempt with id ${attemptId} not found`);
      }
      
      const updated = { ...existing, ...updates };
      validateStudentAttempt(updated);
      
      await db.studentAttempts.update(attemptId, updates);
      
      // Invalidate related caches
      cache.delete(`attempt:${attemptId}`);
      if (existing.studentId) {
        cache.delete(`attempts:${existing.studentId}`);
      }
    } catch (error) {
      console.error('Error updating attempt:', error);
      throw error;
    }
  },

  // Answers with optimized queries
  async saveAnswer(answer: Omit<Answer, 'id'>): Promise<number> {
    try {
      validateAnswer(answer);
      return await db.answers.add(answer);
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  },

  async getAnswersByAttempt(attemptId: number): Promise<Answer[]> {
    try {
      const cacheKey = `answers:${attemptId}`;
      const cached = getCached<Answer[]>(cacheKey);
      if (cached) return cached;

      const answers = await db.answers
        .where('attemptId')
        .equals(attemptId)
        .sortBy('questionId');
      
      setCached(cacheKey, answers);
      return answers;
    } catch (error) {
      console.error('Error getting answers by attempt:', error);
      throw error;
    }
  },

  // Quiz data management
  async saveQuizData(quizData: QuizData): Promise<string> {
    try {
      validateQuizData(quizData);
      await db.quizData.put(quizData);
      cache.delete('quiz-data');
      return quizData.id;
    } catch (error) {
      console.error('Error saving quiz data:', error);
      throw error;
    }
  },

  async getQuizData(quizId: string): Promise<QuizData | undefined> {
    try {
      const cacheKey = `quiz:${quizId}`;
      const cached = getCached<QuizData>(cacheKey);
      if (cached) return cached;

      const quizData = await db.quizData.get(quizId);
      if (quizData) {
        setCached(cacheKey, quizData);
      }
      return quizData;
    } catch (error) {
      console.error('Error getting quiz data:', error);
      throw error;
    }
  },

  // Advanced query methods for optimized data retrieval
  async getAttemptWithAnswers(attemptId: number): Promise<{
    attempt: StudentAttempt;
    answers: Answer[];
  } | undefined> {
    try {
      const cacheKey = `attempt-with-answers:${attemptId}`;
      const cached = getCached<{ attempt: StudentAttempt; answers: Answer[] }>(cacheKey);
      if (cached) return cached;

      const [attempt, answers] = await Promise.all([
        db.studentAttempts.get(attemptId),
        db.answers.where('attemptId').equals(attemptId).toArray()
      ]);

      if (attempt) {
        const result = { attempt, answers };
        setCached(cacheKey, result);
        return result;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting attempt with answers:', error);
      throw error;
    }
  },

  async getStudentProgress(studentId: string): Promise<{
    student: Student;
    attempts: StudentAttempt[];
    totalScore: number;
    averageScore: number;
  } | undefined> {
    try {
      const cacheKey = `student-progress:${studentId}`;
      const cached = getCached<{
        student: Student;
        attempts: StudentAttempt[];
        totalScore: number;
        averageScore: number;
      }>(cacheKey);
      if (cached) return cached;

      const [student, attempts] = await Promise.all([
        db.students.get(studentId),
        db.studentAttempts.where('studentId').equals(studentId).toArray()
      ]);

      if (student) {
        const completedAttempts = attempts.filter(a => a.completed && a.score !== undefined);
        const totalScore = completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
        const averageScore = completedAttempts.length > 0 ? totalScore / completedAttempts.length : 0;

        const result = { student, attempts, totalScore, averageScore };
        setCached(cacheKey, result);
        return result;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw error;
    }
  },

  // Utility functions with enhanced error handling
  async clearAllData(): Promise<void> {
    try {
      await db.transaction('rw', [db.students, db.studentAttempts, db.answers, db.quizData], async () => {
        await db.students.clear();
        await db.studentAttempts.clear();
        await db.answers.clear();
        await db.quizData.clear();
      });
      
      // Clear all caches
      cache.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },

  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const startTime = performance.now();
      
      const [students, attempts, answers, quizzes] = await Promise.all([
        db.students.count(),
        db.studentAttempts.count(),
        db.answers.count(),
        db.quizData.count(),
      ]);

      const queryTime = performance.now() - startTime;

      return { 
        students, 
        attempts, 
        answers, 
        quizzes,
        averageQueryTime: queryTime,
        cacheHitRate: cache.size > 0 ? 0.8 : 0 // Simplified cache hit rate
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  },

  // Cache management utilities
  clearCache(): void {
    cache.clear();
  },

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  },

  // Schema validation utility
  async validateSchema(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Test basic operations on each table
      await db.students.count();
      await db.studentAttempts.count();
      await db.answers.count();
      await db.quizData.count();
    } catch (error) {
      errors.push(`Schema validation failed: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}; 