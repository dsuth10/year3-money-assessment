import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { persistenceUtils } from './stores/persistence';
import { useStudentStore } from './stores/studentStore';
import { useQuizStore } from './stores/quizStore';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  
  const { currentStudent, loadStudents } = useStudentStore();
  const { isQuizActive, resetQuiz } = useQuizStore();
  
  const isLandingPage = location.pathname === '/';

  // Enhanced initialization with better error handling
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        setInitializationError(null);
        
        console.log('Initializing Year 3 Maths application...');
        
        // Initialize database and persistence
        await persistenceUtils.initializeDatabase();
        
        // Load initial data
        await loadStudents();
        
        // Sync state with database
        await persistenceUtils.syncStateWithDatabase();
        
        console.log('Application initialized successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        console.error('Failed to initialize application:', errorMessage);
        setInitializationError(`Initialization failed: ${errorMessage}`);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      persistenceUtils.cleanup().catch(error => {
        console.error('Cleanup error:', error);
      });
    };
  }, [loadStudents]);

  // Enhanced navigation handler with proper error handling
  const handleNavigation = (path: string) => {
    try {
      // Reset quiz state when navigating away from quiz
      if (isQuizActive && path !== '/quiz') {
        resetQuiz();
      }
      
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Enhanced error recovery
  const handleErrorRecovery = async () => {
    try {
      setIsInitializing(true);
      setInitializationError(null);
      
      await persistenceUtils.recoverFromErrors();
      await loadStudents();
      
      console.log('Error recovery completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown recovery error';
      setInitializationError(`Recovery failed: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Initializing Year 3 Maths</h2>
          <p className="text-gray-500">Setting up your learning environment...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initializationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Initialization Error</h2>
          <p className="text-gray-600 mb-4">{initializationError}</p>
          <button
            onClick={handleErrorRecovery}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header with better navigation */}
      {!isLandingPage && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3M</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Year 3 Maths</h1>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/home"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/home'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/quiz"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/quiz'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Quiz
                </Link>
                <Link
                  to="/students"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/students'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Students
                </Link>
              </nav>

              {/* Current Student Display */}
              {currentStudent && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {currentStudent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{currentStudent.name}</p>
                    <p className="text-xs text-gray-500">
                      {currentStudent.totalAttempts} attempts
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                  aria-label="Open menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/home"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/home'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/quiz"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/quiz'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Quiz
              </Link>
              <Link
                to="/students"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/students'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Students
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Enhanced Footer */}
      {!isLandingPage && (
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  © 2024 Year 3 Maths Assessment. Built with React and TypeScript.
                </p>
              </div>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Help
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
