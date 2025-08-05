# Year 3 Money Assessment

A React-based interactive assessment tool for Year 3 students to practice money-related concepts. Built with modern web technologies and designed for offline classroom deployment.

## 🚀 Features

- **21 Interactive Questions** - Various question types including drag-and-drop, sorting, and calculations
- **Offline-First Design** - Works completely offline after initial load
- **Australian Currency** - Authentic coin and note representations
- **Progress Tracking** - Visual progress indicators for students
- **Teacher Export** - CSV export functionality for assessment results
- **Accessibility** - WCAG-AA compliant with keyboard navigation
- **PWA Support** - Installable as a web app for easy classroom deployment
- **Modern State Management** - Zustand for efficient state management
- **Local Data Persistence** - IndexedDB with Dexie for offline data storage

## 🛠️ Tech Stack

- **React 19.1.0** - Latest React with hooks and functional components
- **TypeScript 5.8.3** - Type-safe development with strict configuration
- **Vite 7.0.4** - Fast build tool with HMR and optimized production builds
- **Tailwind CSS 4.1.11** - Latest utility-first CSS framework
- **React Router DOM 7.7.1** - Modern routing with createBrowserRouter
- **Zustand 5.0.7** - Lightweight state management with TypeScript support
- **Dexie 4.0.11** - IndexedDB wrapper for local data persistence
- **PWA** - Progressive Web App with service worker for offline functionality
- **ESLint 9.30.1** - Code quality with type-aware linting

## 📦 Project Structure

```
Year 3 Maths/
├── src/                    # React application source
│   ├── components/         # React components
│   ├── pages/             # Page components (Home, Quiz, Students)
│   ├── stores/            # Zustand state management
│   │   ├── quizStore.ts      # Quiz state management
│   │   ├── studentStore.ts   # Student data management
│   │   └── persistence.ts    # Database integration layer
│   ├── db/                # Database layer
│   │   └── database.ts       # Dexie IndexedDB setup
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── assets/            # Static assets (images, icons)
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

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
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
- **PWA Auto-Update** - Service worker automatically updates when new versions are available
- **Development PWA** - PWA features available in development mode for testing

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

## 🏫 Classroom Deployment

### Offline Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Copy to network share**
   - Copy the entire `dist/` folder to the school network share
   - Example: `\\NetworkShare\MoneyQuiz\`

3. **Student access**
   - Students double-click `index.html` to launch the assessment
   - Works completely offline after initial load

### PWA Features

- **Auto-Update** - New versions automatically update when available
- **Offline Support** - All assets cached for offline use
- **Installable** - Can be installed as a web app on student devices

## 🧪 Testing

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

## 📊 Performance Targets

- **Initial Load**: ≤ 3 seconds on 2017-era Windows laptops
- **Bundle Size**: ≤ 4MB gzipped
- **Drag Latency**: ≤ 16ms per frame
- **IndexedDB Write**: ≤ 20ms

## 🔒 Security & Privacy

- **No External Network Calls** - Completely offline after initial load
- **Local Data Storage** - All student data stored locally in IndexedDB
- **CSP Headers** - Content Security Policy configured for security
- **Pseudonymous IDs** - Student data uses pseudonymous identifiers

## 🎯 Accessibility

- **WCAG-AA Compliance** - Meets educational accessibility standards
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels and semantic HTML
- **High Contrast** - Color contrast meets AA standards

## 📝 License

This project is developed for educational use in Australian schools.

## 🤝 Contributing

For development contributions, please follow the established coding standards and ensure all tests pass before submitting changes.

---

**Built with modern web technologies for reliable classroom deployment.**
