import { dbUtils, type Student, type StudentAttempt } from '../db/database';
import { useQuizStore } from './quizStore';
import { useStudentStore } from './studentStore';

// Enhanced persistence utilities with latest TypeScript patterns and better error handling
export interface PersistenceConfig {
  autoSync: boolean;
  syncInterval: number;
  maxRetries: number;
  retryDelay: number;
}

export interface SyncResult {
  success: boolean;
  errors: string[];
  syncedItems: number;
  timestamp: Date;
}

export interface PersistenceState {
  isInitialized: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  syncErrors: string[];
  config: PersistenceConfig;
}

// Enhanced persistence manager with better error handling and state management
class PersistenceManager {
  private state: PersistenceState = {
    isInitialized: false,
    isSyncing: false,
    lastSync: null,
    syncErrors: [],
    config: {
      autoSync: true,
      syncInterval: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 1000
    }
  };

  private syncInterval: NodeJS.Timeout | null = null;

  // Enhanced initialization with better error handling
  async initializeDatabase(): Promise<void> {
    try {
      console.log('Initializing database...');
      await dbUtils.initializeDatabase();
      
      this.state.isInitialized = true;
      console.log('Database initialized successfully');
      
      // Start auto-sync if enabled
      if (this.state.config.autoSync) {
        this.startAutoSync();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('Failed to initialize database:', errorMessage);
      this.state.syncErrors.push(`Initialization failed: ${errorMessage}`);
      throw new Error(`Database initialization failed: ${errorMessage}`);
    }
  }

  // Enhanced state synchronization with better error handling
  async syncStateWithDatabase(): Promise<SyncResult> {
    if (this.state.isSyncing) {
      return {
        success: false,
        errors: ['Sync already in progress'],
        syncedItems: 0,
        timestamp: new Date()
      };
    }

    this.state.isSyncing = true;
    const errors: string[] = [];
    let syncedItems = 0;

    try {
      console.log('Starting state synchronization...');

      // Sync students
      try {
        const students = await dbUtils.getAllStudents();
        useStudentStore.getState().loadStudents();
        syncedItems += students.length;
        console.log(`Synced ${students.length} students`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Student sync failed: ${errorMessage}`);
        console.error('Student sync error:', errorMessage);
      }

      // Sync quiz state
      try {
        const quizStore = useQuizStore.getState();
        if (quizStore.isQuizActive && quizStore.studentId) {
          // Save current quiz state if active
          await this.saveCurrentQuizState();
          syncedItems++;
          console.log('Synced current quiz state');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Quiz state sync failed: ${errorMessage}`);
        console.error('Quiz state sync error:', errorMessage);
      }

      this.state.lastSync = new Date();
      this.state.syncErrors = errors;

      const result: SyncResult = {
        success: errors.length === 0,
        errors,
        syncedItems,
        timestamp: new Date()
      };

      console.log(`State synchronization completed: ${syncedItems} items synced, ${errors.length} errors`);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      errors.push(`General sync error: ${errorMessage}`);
      console.error('State sync error:', errorMessage);
      
      return {
        success: false,
        errors,
        syncedItems,
        timestamp: new Date()
      };
    } finally {
      this.state.isSyncing = false;
    }
  }

  // Enhanced student persistence with better error handling
  async saveStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const studentId = await dbUtils.addStudent(student);
      
      // Update local state
      await useStudentStore.getState().loadStudents();
      
      console.log(`Student saved successfully: ${studentId}`);
      return studentId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save student:', errorMessage);
      throw new Error(`Failed to save student: ${errorMessage}`);
    }
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      await dbUtils.updateStudent(id, updates);
      
      // Update local state
      await useStudentStore.getState().loadStudents();
      
      console.log(`Student updated successfully: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to update student:', errorMessage);
      throw new Error(`Failed to update student: ${errorMessage}`);
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await dbUtils.deleteStudent(id);
      
      // Update local state
      await useStudentStore.getState().loadStudents();
      
      console.log(`Student deleted successfully: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to delete student:', errorMessage);
      throw new Error(`Failed to delete student: ${errorMessage}`);
    }
  }

  // Enhanced quiz state persistence
  async saveCurrentQuizState(): Promise<string> {
    try {
      const quizStore = useQuizStore.getState();
      
      if (!quizStore.isQuizActive || !quizStore.studentId || !quizStore.quizId) {
        throw new Error('No active quiz to save');
      }

      const attempt: Omit<StudentAttempt, 'id' | 'createdAt'> = {
        studentId: quizStore.studentId,
        quizId: quizStore.quizId,
        answers: quizStore.answers,
        score: this.calculateCurrentScore(),
        maxScore: quizStore.totalQuestions,
        percentage: this.calculateCurrentPercentage(),
        completedAt: new Date()
      };

      const attemptId = await dbUtils.saveAttempt(attempt);
      
      // Update student's attempt count
      await useStudentStore.getState().incrementAttempts(quizStore.studentId);
      
      console.log(`Quiz state saved successfully: ${attemptId}`);
      return attemptId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save quiz state:', errorMessage);
      throw new Error(`Failed to save quiz state: ${errorMessage}`);
    }
  }

  async loadStudentAttempts(studentId: string): Promise<StudentAttempt[]> {
    try {
      return await dbUtils.getAttemptsByStudent(studentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load student attempts:', errorMessage);
      throw new Error(`Failed to load student attempts: ${errorMessage}`);
    }
  }

  // Enhanced settings persistence
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      await dbUtils.setSetting(key, value);
      console.log(`Setting saved successfully: ${key}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save setting:', errorMessage);
      throw new Error(`Failed to save setting: ${errorMessage}`);
    }
  }

  async loadSetting(key: string): Promise<any> {
    try {
      return await dbUtils.getSetting(key);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load setting:', errorMessage);
      throw new Error(`Failed to load setting: ${errorMessage}`);
    }
  }

  // Enhanced auto-sync functionality
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.syncStateWithDatabase();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }, this.state.config.syncInterval);

    console.log('Auto-sync started');
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  // Enhanced configuration management
  updateConfig(config: Partial<PersistenceConfig>): void {
    this.state.config = { ...this.state.config, ...config };
    
    // Restart auto-sync if interval changed
    if (config.syncInterval && this.state.config.autoSync) {
      this.stopAutoSync();
      this.startAutoSync();
    }
    
    console.log('Persistence config updated:', this.state.config);
  }

  // Enhanced state management
  getState(): PersistenceState {
    return { ...this.state };
  }

  // Enhanced utility methods
  private calculateCurrentScore(): number {
    const quizStore = useQuizStore.getState();
    return Object.values(quizStore.answers)
      .filter(answer => answer.isCorrect)
      .length;
  }

  private calculateCurrentPercentage(): number {
    const quizStore = useQuizStore.getState();
    const score = this.calculateCurrentScore();
    return quizStore.totalQuestions > 0 ? (score / quizStore.totalQuestions) * 100 : 0;
  }

  // Enhanced cleanup
  async cleanup(): Promise<void> {
    try {
      this.stopAutoSync();
      
      // Save any pending state
      const quizStore = useQuizStore.getState();
      if (quizStore.isQuizActive) {
        await this.saveCurrentQuizState();
      }
      
      await dbUtils.closeDatabase();
      console.log('Persistence cleanup completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown cleanup error';
      console.error('Cleanup error:', errorMessage);
      throw new Error(`Cleanup failed: ${errorMessage}`);
    }
  }

  // Enhanced error recovery
  async recoverFromErrors(): Promise<void> {
    try {
      console.log('Attempting to recover from persistence errors...');
      
      // Clear error state
      this.state.syncErrors = [];
      
      // Reinitialize database
      await this.initializeDatabase();
      
      // Force a full sync
      await this.syncStateWithDatabase();
      
      console.log('Error recovery completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown recovery error';
      console.error('Error recovery failed:', errorMessage);
      throw new Error(`Error recovery failed: ${errorMessage}`);
    }
  }
}

// Export singleton instance
export const persistenceUtils = new PersistenceManager(); 