# Year 3 Money Assessment

A React-based interactive assessment tool for Year 3 students to practice money-related concepts. Built with modern web technologies and designed for offline classroom deployment.

## 🚀 Features

- **21 Interactive Questions** - Various question types including drag-and-drop, sorting, and calculations
- **Enhanced Question Interface** - Responsive layout with drag-and-drop currency components
- **Offline-First Design** - Works completely offline after initial load
- **Australian Currency** - Authentic coin and note representations
- **Progress Tracking** - Visual progress indicators for students
- **Teacher Export** - CSV export functionality for assessment results
- **Accessibility** - WCAG-AA compliant with keyboard navigation
- **PWA Support** - Installable as a web app for easy classroom deployment
- **Modern State Management** - Zustand for efficient state management
- **Local Data Persistence** - IndexedDB with Dexie for offline data storage
- **Comprehensive Testing** - Vitest with Testing Library for component testing

## 🛠️ Tech Stack

- **React 19.1.0** - Latest React with hooks and functional components
- **TypeScript 5.8.3** - Type-safe development with strict configuration
- **Vite 7.0.4** - Fast build tool with HMR and optimized production builds
- **Tailwind CSS 4.1.11** - Latest utility-first CSS framework
- **React Router DOM 7.7.1** - Modern routing with createBrowserRouter
- **Zustand 5.0.7** - Lightweight state management with TypeScript support
- **Dexie 4.0.11** - IndexedDB wrapper for local data persistence
- **@dnd-kit** - Modern drag-and-drop library for currency interactions
- **Vitest 2.1.8** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **PWA** - Progressive Web App with service worker for offline functionality
- **ESLint 9.30.1** - Code quality with type-aware linting

## 📦 Project Structure

```
Year 3 Maths/
├── src/                    # React application source
│   ├── components/         # React components
│   │   ├── QuestionInterface.tsx           # Main question interface component
│   │   ├── QuestionInterfaceContainer.tsx  # Container for state management
│   │   ├── questions/                      # Question-specific components
│   │   │   └── DragDropQuestionInterface.tsx  # Drag-and-drop question interface
│   │   ├── currency/                       # Currency-related components
│   │   │   ├── DraggableCurrencyItem.tsx     # Draggable currency items
│   │   │   └── CurrencyDropZone.tsx          # Drop zones for currency
│   │   ├── QuestionActionButtons.tsx       # Action buttons component
│   │   ├── BottomNavigation.tsx            # Bottom navigation component
│   │   └── __tests__/                      # Component test files
│   │       └── QuestionInterface.test.tsx     # QuestionInterface tests
│   ├── pages/             # Page components (Home, Quiz, Students)
│   ├── stores/            # Zustand state management
│   │   ├── quizStore.ts      # Quiz state management
│   │   ├── studentStore.ts   # Student data management
│   │   ├── quizSelectors.ts  # Quiz state selectors
│   │   └── persistence.ts    # Database integration layer
│   ├── db/                # Database layer
│   │   └── database.ts       # Dexie IndexedDB setup
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── assets/            # Static assets (images, icons)
│   ├── test/              # Test configuration
│   │   └── setup.ts          # Vitest setup with accessibility mocks
│   ├── App.tsx            # Main application component with navigation
│   ├── main.tsx           # Application entry point with RouterProvider
│   ├── routes.tsx         # React Router configuration
│   └── index.css          # Global styles with Tailwind
├── public/                # Static files
├── dist/                  # Production build output
├── Planning/              # Project planning and screenshots
├── Static/                # Static assets (currency images)
├── .github/               # GitHub Actions and templates
├── .cursor/               # Cursor IDE configuration
├── .taskmaster/           # Task management system
├── vite.config.ts         # Vite configuration with PWA
├── vitest.config.ts       # Vitest test configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── Year3_Money_Assessment_PRD.md  # Product requirements document
```

## 🚀 Getting Started Guide

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dsuth10/year3-money-assessment.git
   cd year3-money-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test:run
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔧 Development

### Modern Architecture Features

- **React Router v7** - Uses `createBrowserRouter` with `RouterProvider` for modern routing
- **Zustand v5** - Lightweight state management with TypeScript interfaces
- **Dexie v4** - IndexedDB wrapper for local data persistence with schema management
- **TypeScript ESM Support** - Uses `moduleResolution: "bundler"` for optimal ESM support
- **Tailwind CSS v4** - Latest version with TypeScript configuration
- **@dnd-kit** - Modern drag-and-drop library for currency interactions
- **Vitest** - Fast unit testing with Testing Library integration
- **PWA Auto-Update** - Service worker automatically updates when new versions are available
- **Development PWA** - PWA features available in development mode for testing

### Component Architecture

The application uses a modern component architecture with container-presenter pattern:

#### QuestionInterface Component
```typescript
// Presentational Component - Focused on rendering
interface QuestionInterfaceProps {
  question: Question;
  availableCurrency?: CurrencyItem[];
  dropZones?: DropZone[];
  isLoading?: boolean;
  error?: string | null;
  // ... other props
}

// Container Component - Handles state and logic
interface QuestionInterfaceContainerProps {
  question: Question;
  // ... same props as presentational
}
```

#### Drag-and-Drop Currency System
```typescript
// Currency Item Interface
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

// Drop Zone Configuration
interface DropZone {
  id: string;
  title: string;
  description: string;
  targetValue?: number;
  acceptedTypes?: string[];
}
```

### State Management Architecture

The application uses a modern state management pattern with Zustand:

```typescript
// Quiz Store - Manages quiz state and progress
useQuizStore: {
  currentQuestion: number;
  answers: Record<number, string>;
  isQuizActive: boolean;
  quizId: string | null;
  studentId: string | null;
  setAnswer: (questionId: number, answer: any) => void;
  skipQuestion: (questionId: number) => void;
  submitQuestion: (questionId: number) => void;
}

// Student Store - Manages student data
useStudentStore: {
  students: Student[];
  currentStudent: Student | null;
  isLoading: boolean;
}
```

### Database Architecture

Local data persistence using Dexie IndexedDB:

```typescript
// Database Tables
studentAttempts: StudentAttempt[]  // Quiz attempts by students
answers: Answer[]                  // Individual question answers
students: Student[]                // Student information
quizData: QuizData[]              // Quiz questions and metadata
```

### Testing Architecture

Comprehensive testing setup with Vitest and Testing Library:

```typescript
// Test Configuration
vitest.config.ts:
- jsdom environment for DOM testing
- React plugin for JSX support
- Accessibility mocks for ResizeObserver, IntersectionObserver
- CSS support for Tailwind classes

// Test Setup
src/test/setup.ts:
- @testing-library/jest-dom for custom matchers
- Global mocks for browser APIs
- Accessibility testing utilities
```

### Key Configuration Files

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
```

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
});
```

#### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

#### `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
    "strict": true
  }
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test:run src/components/__tests__/QuestionInterface.test.tsx
```

### Test Coverage
- **Component Testing** - All major components have comprehensive test suites
- **Accessibility Testing** - ARIA roles, keyboard navigation, screen reader support
- **State Management Testing** - Zustand store integration and state transitions
- **Drag-and-Drop Testing** - Currency interaction testing with @dnd-kit
- **Integration Testing** - Component integration and user flow testing

### Development Testing
```bash
# Start development server with PWA enabled
npm run dev

# Test offline functionality
# 1. Load the app in browser
# 2. Open DevTools → Network tab
# 3. Check "Offline" checkbox
# 4. Refresh page - should work offline
```

### Production Testing
```bash
# Build and test production version
npm run build
npm run preview

# Test PWA features
# 1. Open in browser
# 2. Check Application tab in DevTools
# 3. Verify service worker is registered
# 4. Test offline functionality
```

## 🎨 UI Components

### QuestionInterface Component
The main question interface provides:
- **Responsive Layout** - Mobile-first design with Tailwind CSS
- **Drag-and-Drop Support** - Specialized interface for currency questions
- **Accessibility** - Full ARIA support and keyboard navigation
- **Loading States** - Proper loading and error state handling
- **Custom Content** - Support for custom header, main content, and sidebar

### Currency Components
- **DraggableCurrencyItem** - Individual currency items with drag functionality
- **CurrencyDropZone** - Drop zones for currency placement
- **DragDropQuestionInterface** - Specialized interface for drag-and-drop questions

### Navigation Components
- **QuestionActionButtons** - Skip and submit buttons with accessibility
- **BottomNavigation** - Question navigation with progress indicators

## 📊 Performance Targets

- **Initial Load**: ≤ 3 seconds on 2017-era Windows laptops
- **Bundle Size**: ≤ 4MB gzipped
- **Drag Latency**: ≤ 16ms per frame
- **IndexedDB Write**: ≤ 20ms
- **Test Execution**: ≤ 5 seconds for full test suite

## 🔒 Security & Privacy

- **No External Network Calls** - Completely offline after initial load
- **Local Data Storage** - All student data stored locally in IndexedDB
- **CSP Headers** - Content Security Policy configured for security
- **Pseudonymous IDs** - Student data uses pseudonymous identifiers

## 🎯 Accessibility

- **WCAG-AA Compliance** - Meets educational accessibility standards
- **Keyboard Navigation** - Full keyboard accessibility for all components
- **Screen Reader Support** - ARIA labels and semantic HTML
- **High Contrast** - Color contrast meets AA standards
- **Drag-and-Drop Accessibility** - Keyboard support for drag-and-drop interactions

## 📝 License

This project is developed for educational use in Australian schools.

## 🤝 Contributing

For development contributions, please follow the established coding standards and ensure all tests pass before submitting changes.

### Development Guidelines
- **TypeScript** - All code must be properly typed
- **Testing** - New components require comprehensive test coverage
- **Accessibility** - All components must meet WCAG-AA standards
- **Performance** - Components should meet performance targets
- **Documentation** - Code should be well-documented with JSDoc comments

---

**Built with modern web technologies for reliable classroom deployment.**
