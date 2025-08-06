import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useStudentStore } from '../stores/studentStore';

interface LandingProps {
  onStudentSet?: (studentId: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onStudentSet }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Temporary test version
  const isLoading = false;

  // Autofocus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Validate name input
  useEffect(() => {
    const trimmedName = name.trim();
    setIsValid(trimmedName.length >= 2);
    setError('');
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting) return;

    const trimmedName = name.trim();
    setIsSubmitting(true);
    setError('');

    try {
      // Temporary test version - just redirect
      console.log('Student name:', trimmedName);
      navigate('/quiz');
      
    } catch (err) {
      setError('Failed to process student information. Please try again.');
      console.error('Error in student submission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg 
              className="h-8 w-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Year 3 Money Assessment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your name to begin
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="student-name" 
              className="sr-only"
            >
              Student Name
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="student-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your name"
                aria-describedby={error ? "name-error" : undefined}
                aria-invalid={error ? "true" : "false"}
                disabled={isSubmitting || isLoading}
              />
            </div>
            {error && (
              <p 
                id="name-error" 
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
            {!error && name.trim() && !isValid && (
              <p className="mt-2 text-sm text-gray-500">
                Name must be at least 2 characters long
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isValid && !isSubmitting && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors duration-200`}
              aria-describedby={!isValid ? "submit-help" : undefined}
            >
              {isSubmitting || isLoading ? (
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isSubmitting || isLoading ? 'Processing...' : 'Start Assessment'}
            </button>
            {!isValid && (
              <p id="submit-help" className="mt-2 text-sm text-gray-500">
                Please enter a valid name to continue
              </p>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your progress will be saved automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing; 