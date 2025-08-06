import { openDB, type IDBPDatabase } from 'idb';

// Enhanced database types with better TypeScript support
export interface Student {
  id: string;
  name: string;
  totalAttempts: number;
  lastAttempt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: Record<number, Answer>;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
  createdAt: Date;
}

export interface Answer {
  value: string | number | boolean | any[];
  isCorrect: boolean;
  score: number;
  feedback?: string;
  submittedAt: Date;
}

// Enhanced database configuration
const DB_NAME = 'Year3MathsDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  STUDENTS: 'students',
  ATTEMPTS: 'attempts',
  SETTINGS: 'settings'
} as const;

// Enhanced database schema
interface DBSchema {
  students: {
    key: string;
    value: Student;
    indexes: {
      'by-name': string;
      'by-created': Date;
    };
  };
  attempts: {
    key: string;
    value: StudentAttempt;
    indexes: {
      'by-student': string;
      'by-quiz': string;
      'by-date': Date;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

// Enhanced database utilities with latest TypeScript patterns
class DatabaseManager {
  private db: IDBPDatabase<DBSchema> | null = null;
  private isInitialized = false;

  // Enhanced initialization with better error handling
  async initializeDatabase(): Promise<void> {
    try {
      if (this.isInitialized && this.db) {
        return;
      }

      this.db = await openDB<DBSchema>(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion, newVersion) => {
          console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);

          // Create students store
          if (!db.objectStoreNames.contains(STORES.STUDENTS)) {
            const studentsStore = db.createObjectStore(STORES.STUDENTS, { keyPath: 'id' });
            studentsStore.createIndex('by-name', 'name');
            studentsStore.createIndex('by-created', 'createdAt');
          }

          // Create attempts store
          if (!db.objectStoreNames.contains(STORES.ATTEMPTS)) {
            const attemptsStore = db.createObjectStore(STORES.ATTEMPTS, { keyPath: 'id' });
            attemptsStore.createIndex('by-student', 'studentId');
            attemptsStore.createIndex('by-quiz', 'quizId');
            attemptsStore.createIndex('by-date', 'completedAt');
          }

          // Create settings store
          if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
            db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
          }
        },
        blocked: () => {
          console.warn('Database upgrade was blocked');
        },
        blocking: () => {
          console.warn('Database is blocking other connections');
        },
        terminated: () => {
          console.error('Database connection was terminated');
          this.isInitialized = false;
          this.db = null;
        }
      });

      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      console.error('Failed to initialize database:', errorMessage);
      throw new Error(`Database initialization failed: ${errorMessage}`);
    }
  }

  // Enhanced student operations
  async addStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const id = crypto.randomUUID();
      const now = new Date();
      const newStudent: Student = {
        ...student,
        id,
        createdAt: now,
        updatedAt: now
      };

      await this.db!.add(STORES.STUDENTS, newStudent);
      console.log(`Student added successfully: ${id}`);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to add student:', errorMessage);
      throw new Error(`Failed to add student: ${errorMessage}`);
    }
  }

  async getStudent(id: string): Promise<Student | undefined> {
    try {
      await this.ensureInitialized();
      return await this.db!.get(STORES.STUDENTS, id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get student:', errorMessage);
      throw new Error(`Failed to get student: ${errorMessage}`);
    }
  }

  async getStudentByName(name: string): Promise<Student | undefined> {
    try {
      await this.ensureInitialized();
      const tx = this.db!.transaction(STORES.STUDENTS, 'readonly');
      const store = tx.objectStore(STORES.STUDENTS);
      const index = store.index('by-name');
      return await index.get(name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get student by name:', errorMessage);
      throw new Error(`Failed to get student by name: ${errorMessage}`);
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      await this.ensureInitialized();
      return await this.db!.getAll(STORES.STUDENTS);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get all students:', errorMessage);
      throw new Error(`Failed to get all students: ${errorMessage}`);
    }
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const student = await this.getStudent(id);
      if (!student) {
        throw new Error(`Student with id ${id} not found`);
      }

      const updatedStudent: Student = {
        ...student,
        ...updates,
        updatedAt: new Date()
      };

      await this.db!.put(STORES.STUDENTS, updatedStudent);
      console.log(`Student updated successfully: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to update student:', errorMessage);
      throw new Error(`Failed to update student: ${errorMessage}`);
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.db!.delete(STORES.STUDENTS, id);
      console.log(`Student deleted successfully: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to delete student:', errorMessage);
      throw new Error(`Failed to delete student: ${errorMessage}`);
    }
  }

  // Enhanced attempt operations
  async saveAttempt(attempt: Omit<StudentAttempt, 'id' | 'createdAt'>): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const id = crypto.randomUUID();
      const now = new Date();
      const newAttempt: StudentAttempt = {
        ...attempt,
        id,
        createdAt: now
      };

      await this.db!.add(STORES.ATTEMPTS, newAttempt);
      console.log(`Attempt saved successfully: ${id}`);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save attempt:', errorMessage);
      throw new Error(`Failed to save attempt: ${errorMessage}`);
    }
  }

  async getAttempt(id: string): Promise<StudentAttempt | undefined> {
    try {
      await this.ensureInitialized();
      return await this.db!.get(STORES.ATTEMPTS, id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get attempt:', errorMessage);
      throw new Error(`Failed to get attempt: ${errorMessage}`);
    }
  }

  async getAttemptsByStudent(studentId: string): Promise<StudentAttempt[]> {
    try {
      await this.ensureInitialized();
      const tx = this.db!.transaction(STORES.ATTEMPTS, 'readonly');
      const store = tx.objectStore(STORES.ATTEMPTS);
      const index = store.index('by-student');
      return await index.getAll(studentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get attempts by student:', errorMessage);
      throw new Error(`Failed to get attempts by student: ${errorMessage}`);
    }
  }

  async getAttemptsByQuiz(quizId: string): Promise<StudentAttempt[]> {
    try {
      await this.ensureInitialized();
      const tx = this.db!.transaction(STORES.ATTEMPTS, 'readonly');
      const store = tx.objectStore(STORES.ATTEMPTS);
      const index = store.index('by-quiz');
      return await index.getAll(quizId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get attempts by quiz:', errorMessage);
      throw new Error(`Failed to get attempts by quiz: ${errorMessage}`);
    }
  }

  async getAllAttempts(): Promise<StudentAttempt[]> {
    try {
      await this.ensureInitialized();
      return await this.db!.getAll(STORES.ATTEMPTS);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get all attempts:', errorMessage);
      throw new Error(`Failed to get all attempts: ${errorMessage}`);
    }
  }

  // Enhanced settings operations
  async getSetting(key: string): Promise<any> {
    try {
      await this.ensureInitialized();
      const setting = await this.db!.get(STORES.SETTINGS, key);
      return setting?.value;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get setting:', errorMessage);
      throw new Error(`Failed to get setting: ${errorMessage}`);
    }
  }

  async setSetting(key: string, value: any): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.db!.put(STORES.SETTINGS, { key, value });
      console.log(`Setting saved successfully: ${key}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to set setting:', errorMessage);
      throw new Error(`Failed to set setting: ${errorMessage}`);
    }
  }

  // Enhanced utility methods
  async clearDatabase(): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const tx = this.db!.transaction([STORES.STUDENTS, STORES.ATTEMPTS, STORES.SETTINGS], 'readwrite');
      
      await tx.objectStore(STORES.STUDENTS).clear();
      await tx.objectStore(STORES.ATTEMPTS).clear();
      await tx.objectStore(STORES.SETTINGS).clear();
      
      console.log('Database cleared successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to clear database:', errorMessage);
      throw new Error(`Failed to clear database: ${errorMessage}`);
    }
  }

  async getDatabaseInfo(): Promise<{
    studentCount: number;
    attemptCount: number;
    settingCount: number;
  }> {
    try {
      await this.ensureInitialized();
      
      const students = await this.db!.getAll(STORES.STUDENTS);
      const attempts = await this.db!.getAll(STORES.ATTEMPTS);
      const settings = await this.db!.getAll(STORES.SETTINGS);
      
      return {
        studentCount: students.length,
        attemptCount: attempts.length,
        settingCount: settings.length
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get database info:', errorMessage);
      throw new Error(`Failed to get database info: ${errorMessage}`);
    }
  }

  // Private helper methods
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.db) {
      await this.initializeDatabase();
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('Database connection closed');
    }
  }
}

// Export singleton instance
export const dbUtils = new DatabaseManager(); 