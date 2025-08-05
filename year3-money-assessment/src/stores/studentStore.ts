import { create } from "zustand";

interface Student {
  id: string;
  name: string;
  grade: string;
  lastAttempt?: Date;
  totalAttempts: number;
}

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  isLoading: boolean;
}

interface StudentActions {
  addStudent: (student: Omit<Student, 'totalAttempts'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  setCurrentStudent: (student: Student | null) => void;
  setLoading: (loading: boolean) => void;
  getStudentById: (id: string) => Student | undefined;
  incrementAttempts: (studentId: string) => void;
}

type StudentStore = StudentState & StudentActions;

export const useStudentStore = create<StudentStore>((set, get) => ({
  // State
  students: [],
  currentStudent: null,
  isLoading: false,

  // Actions
  addStudent: (student) => 
    set((state) => ({
      students: [...state.students, { ...student, totalAttempts: 0 }]
    })),

  updateStudent: (id, updates) => 
    set((state) => ({
      students: state.students.map(student => 
        student.id === id ? { ...student, ...updates } : student
      )
    })),

  removeStudent: (id) => 
    set((state) => ({
      students: state.students.filter(student => student.id !== id)
    })),

  setCurrentStudent: (student) => 
    set({ currentStudent: student }),

  setLoading: (loading) => 
    set({ isLoading: loading }),

  getStudentById: (id) => 
    get().students.find(student => student.id === id),

  incrementAttempts: (studentId) => 
    set((state) => ({
      students: state.students.map(student => 
        student.id === studentId 
          ? { ...student, totalAttempts: student.totalAttempts + 1, lastAttempt: new Date() }
          : student
      )
    })),
})); 