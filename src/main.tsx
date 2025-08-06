import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';

// Enhanced error boundary for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">💥</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced root component with better initialization
const Root = () => {
  return (
    <ErrorBoundary>
      <RouterProvider 
        router={router} 
        fallbackElement={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Year 3 Maths</h2>
              <p className="text-gray-500">Please wait...</p>
            </div>
          </div>
        }
      />
    </ErrorBoundary>
  );
};

// Enhanced initialization with better error handling
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <Root />
      </React.StrictMode>
    );

    console.log('Year 3 Maths application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Show fallback error UI
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="text-align: center; max-width: 400px; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">💥</div>
            <h2 style="font-size: 1.5rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
              Application Error
            </h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">
              Failed to initialize the application. Please check your browser console for details.
            </p>
            <button 
              onclick="window.location.reload()"
              style="
                background: #4f46e5;
                color: white;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.background='#4338ca'"
              onmouseout="this.style.background='#4f46e5'"
            >
              Refresh Page
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Initialize the application
initializeApp();
