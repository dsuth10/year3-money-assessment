import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { persistenceUtils } from './stores/persistence'
import './App.css'

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Initialize database and sync state on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await persistenceUtils.initializeDatabase();
        await persistenceUtils.syncStateWithDatabase();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header - Hidden on landing page */}
      {!isLandingPage && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    Year 3 Money Assessment
                  </h1>
                </div>
              </div>
              
              <div className="flex space-x-8">
                <Link
                  to="/home"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/home' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/quiz"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/quiz' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Quiz
                </Link>
                <Link
                  to="/students"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/students' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Students
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={isLandingPage ? "" : "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"}>
        <div className={isLandingPage ? "" : "px-4 py-6 sm:px-0"}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App
