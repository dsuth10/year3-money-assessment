import { create } from "zustand";
import { dbUtils, type Student } from "../db/database";

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  isLoading: boolean;
  error: string | null;
}

interface StudentActions {
  addStudent: (student: Omit<Student, 'totalAttempts'>) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  setCurrentStudent: (student: Student | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getStudentById: (id: string) => Student | undefined;
  incrementAttempts: (studentId: string) => Promise<void>;
  loadStudents: () => Promise<void>;
  loadStudent: (id: string) => Promise<void>;
}

type StudentStore = StudentState & StudentActions;

export const useStudentStore = create<StudentStore>((set, get) => ({
  // State
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,

  // Actions
  addStudent: async (student) => {
    try {
      set({ isLoading: true, error: null });
      await dbUtils.addStudent(student);
      await get().loadStudents(); // Refresh the list
    } catch (error) {
      set({ error: `Failed to add student: ${error}` });
      console.error('Error adding student:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateStudent: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await dbUtils.updateStudent(id, updates);
      
      // Update local state
      set((state) => ({
        students: state.students.map(student => 
          student.id === id ? { ...student, ...updates } : student
        ),
        currentStudent: state.currentStudent?.id === id 
          ? { ...state.currentStudent, ...updates }
          : state.currentStudent
      }));
    } catch (error) {
      set({ error: `Failed to update student: ${error}` });
      console.error('Error updating student:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeStudent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      // Note: dbUtils doesn't have removeStudent, so we'll just update local state
      // In a real implementation, you'd add a removeStudent method to dbUtils
      set((state) => ({
        students: state.students.filter(student => student.id !== id),
        currentStudent: state.currentStudent?.id === id ? null : state.currentStudent
      }));
    } catch (error) {
      set({ error: `Failed to remove student: ${error}` });
      console.error('Error removing student:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentStudent: (student) => 
    set({ currentStudent: student }),

  setLoading: (loading) => 
    set({ isLoading: loading }),

  setError: (error) => 
    set({ error }),

  getStudentById: (id) => 
    get().students.find(student => student.id === id),

  getStudentByName: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const student = await dbUtils.getStudentByName(name);
      return student;
    } catch (error) {
      set({ error: `Failed to find student by name: ${error}` });
      console.error('Error finding student by name:', error);
      return undefined;
    } finally {
      set({ isLoading: false });
    }
  },

  incrementAttempts: async (studentId) => {
    try {
      set({ isLoading: true, error: null });
      const student = get().getStudentById(studentId);
      if (student) {
        await dbUtils.updateStudent(studentId, {
          totalAttempts: student.totalAttempts + 1,
          lastAttempt: new Date()
        });
        
        // Update local state
        set((state) => ({
          students: state.students.map(student => 
            student.id === studentId 
              ? { ...student, totalAttempts: student.totalAttempts + 1, lastAttempt: new Date() }
              : student
          ),
          currentStudent: state.currentStudent?.id === studentId 
            ? { ...state.currentStudent, totalAttempts: state.currentStudent.totalAttempts + 1, lastAttempt: new Date() }
            : state.currentStudent
        }));
      }
    } catch (error) {
      set({ error: `Failed to increment attempts: ${error}` });
      console.error('Error incrementing attempts:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadStudents: async () => {
    try {
      set({ isLoading: true, error: null });
      const students = await dbUtils.getAllStudents();
      set({ students });
    } catch (error) {
      set({ error: `Failed to load students: ${error}` });
      console.error('Error loading students:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadStudent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const student = await dbUtils.getStudent(id);
      if (student) {
        set({ currentStudent: student });
      } else {
        set({ error: `Student with id ${id} not found` });
      }
    } catch (error) {
      set({ error: `Failed to load student: ${error}` });
      console.error('Error loading student:', error);
    } finally {
      set({ isLoading: false });
    }
  },
})); 