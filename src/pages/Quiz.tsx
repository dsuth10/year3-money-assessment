import { useQuizStore } from '../stores/quizStore'
import { useStudentStore } from '../stores/studentStore'
import QuestionRenderer from '../components/questions/QuestionRenderer'
import FeedbackDisplay from '../components/FeedbackDisplay'

function Quiz() {
  const { 
    isQuizActive, 
    currentQuestion, 
    answers, 
    setAnswer, 
    setCurrentQuestion, 
    startQuiz, 
    resetQuiz,
    saveAnswer,
    isLoading,
    error,
    validationResults,
    totalScore
  } = useQuizStore()
  
  const { students, currentStudent, setCurrentStudent } = useStudentStore()

  const handleStartQuiz = (studentId: string) => {
    startQuiz('money-quiz-1', studentId)
    const student = students.find(s => s.id === studentId)
    if (student) {
      setCurrentStudent(student)
    }
  }

  const handleAnswerQuestion = async (questionId: number, answer: any) => {
    try {
      // Save answer to IndexedDB
      await saveAnswer(questionId, JSON.stringify(answer))
      
      // Update local state
      setAnswer(questionId, JSON.stringify(answer))
      
      // Move to next question if not the last question
      if (currentQuestion < 9) { // Q1-Q10 (0-9)
        setCurrentQuestion(currentQuestion + 1)
      }
    } catch (error) {
      console.error('Error saving answer:', error)
    }
  }

  const handleResetQuiz = () => {
    resetQuiz()
    setCurrentStudent(null)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < 9) { // Q1-Q10 (0-9)
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleGoToQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber - 1) // Convert to 0-based index
  }

  const handleCompleteQuiz = async () => {
    try {
      // Calculate final score and complete quiz
      // This would typically trigger a completion screen
      console.log('Quiz completed with score:', totalScore)
    } catch (error) {
      console.error('Error completing quiz:', error)
    }
  }

  if (!isQuizActive) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Quiz</h2>
        <p className="text-gray-600 mb-6">Select a student to begin the money assessment quiz.</p>
        
        <div className="space-y-3">
          {students.map(student => (
            <button
              key={student.id}
              onClick={() => handleStartQuiz(student.id)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.grade}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {student.totalAttempts} attempts
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Money Assessment Quiz
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCompleteQuiz}
            disabled={Object.keys(answers).length < 10}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Quiz
          </button>
          <button
            onClick={handleResetQuiz}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            End Quiz
          </button>
        </div>
      </div>

      {currentStudent && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">Current Student</h3>
          <p className="text-blue-700">{currentStudent.name} - {currentStudent.grade}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Question Content */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Question {currentQuestion + 1} of 10
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0 || isLoading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to previous question"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestion === 9 || isLoading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to next question"
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Question Renderer */}
        <QuestionRenderer
          questionId={currentQuestion + 1}
          onAnswer={(answer) => handleAnswerQuestion(currentQuestion + 1, answer)}
          currentAnswer={answers[currentQuestion + 1] ? JSON.parse(answers[currentQuestion + 1]) : undefined}
          disabled={isLoading}
        />
      </div>

      {/* Feedback and Progress Display */}
      <div className="mb-6">
        <FeedbackDisplay
          questionId={currentQuestion + 1}
          validationResult={validationResults[currentQuestion + 1]}
        />
      </div>

      {/* Progress Navigation */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleGoToQuestion(i + 1)}
              disabled={isLoading}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${answers[i + 1] 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : i === currentQuestion
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label={`Go to question ${i + 1}${answers[i + 1] ? ' (answered)' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
        {/* Progress Summary */}
        <div className="mt-4 text-sm text-gray-600">
          {Object.keys(answers).length} of 10 questions answered
          {Object.keys(answers).length === 10 && (
            <span className="ml-2 text-green-600 font-medium">
              ✓ Quiz ready to complete
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz 