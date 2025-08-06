import { useQuizStore } from '../stores/quizStore'
import { useStudentStore } from '../stores/studentStore'
import { 
  useQuizActive, 
  useCurrentQuestion, 
  useQuizProgress, 
  useQuizLoading, 
  useQuizError, 
  useTotalScore,
  useCanSkipCurrentQuestion,
  useCanSubmitCurrentQuestion,
  useQuizCompleted,
  useCompletionPercentage,
  useQuestionStatus,
  useQuestionAnswer
} from '../stores/quizSelectors'
import QuestionRenderer from '../components/questions/QuestionRenderer'
import FeedbackDisplay from '../components/FeedbackDisplay'
import BottomNavigation from '../components/BottomNavigation'

function Quiz() {
  // Use memoized selectors for efficient re-renders
  const isQuizActive = useQuizActive()
  const currentQuestion = useCurrentQuestion()
  const quizProgress = useQuizProgress()
  const isLoading = useQuizLoading()
  const error = useQuizError()
  const totalScore = useTotalScore()
  const canSkipCurrent = useCanSkipCurrentQuestion()
  const canSubmitCurrent = useCanSubmitCurrentQuestion()
  const isQuizCompleted = useQuizCompleted()
  const completionPercentage = useCompletionPercentage()
  
  // Get current question details
  const currentQuestionId = currentQuestion + 1
  const currentQuestionStatus = useQuestionStatus(currentQuestionId)
  const currentAnswer = useQuestionAnswer(currentQuestionId)
  
  // Get store actions
  const { 
    setAnswer, 
    setCurrentQuestion, 
    startQuiz, 
    resetQuiz,
    saveAnswer,
    skipQuestion,
    submitQuestion,
    completeQuiz
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

  const handleSkipQuestion = () => {
    skipQuestion(currentQuestionId)
    
    // Move to next question if not the last question
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmitQuestion = () => {
    if (currentAnswer) {
      submitQuestion(currentQuestionId, currentAnswer)
      
      // Move to next question if not the last question
      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1)
      }
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
    // Handle both 1-based and 0-based question numbers
    const questionIndex = questionNumber > 0 ? questionNumber - 1 : questionNumber;
    if (questionIndex >= 0 && questionIndex < 22) { // Support all 22 questions
      setCurrentQuestion(questionIndex);
    }
  }

  const handleCompleteQuiz = async () => {
    try {
      await completeQuiz()
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
            disabled={!isQuizCompleted || isLoading}
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

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {quizProgress.submittedQuestions + quizProgress.answeredQuestions} of {quizProgress.totalQuestions} questions completed
          {quizProgress.skippedQuestions > 0 && (
            <span className="ml-2 text-orange-600">
              ({quizProgress.skippedQuestions} skipped)
            </span>
          )}
        </div>
      </div>

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
        
        {/* Question Status Indicator */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            currentQuestionStatus === 'pending' ? 'bg-gray-100 text-gray-800' :
            currentQuestionStatus === 'skipped' ? 'bg-orange-100 text-orange-800' :
            currentQuestionStatus === 'submitted' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {currentQuestionStatus === 'pending' ? 'Pending' :
             currentQuestionStatus === 'skipped' ? 'Skipped' :
             currentQuestionStatus === 'submitted' ? 'Submitted' :
             'Answered'}
          </span>
        </div>
        
        {/* Question Renderer */}
        <QuestionRenderer
          questionId={currentQuestionId}
          onAnswer={(answer) => handleAnswerQuestion(currentQuestionId, answer)}
          currentAnswer={currentAnswer ? JSON.parse(currentAnswer) : undefined}
          disabled={isLoading}
        />
      </div>

      {/* Question Actions */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={handleSubmitQuestion}
          disabled={!canSubmitCurrent || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
        <button
          onClick={handleSkipQuestion}
          disabled={!canSkipCurrent || isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip Question
        </button>
      </div>

      {/* Feedback and Progress Display */}
      <div className="mb-6">
        <FeedbackDisplay
          questionId={currentQuestionId}
          validationResult={null} // Will be updated when validation is implemented
        />
      </div>

      {/* Progress Navigation */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => {
            const questionId = i + 1
            const questionStatus = useQuestionStatus(questionId)
            
            return (
              <button
                key={i}
                onClick={() => handleGoToQuestion(questionId)}
                disabled={isLoading}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${questionStatus === 'answered' 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : questionStatus === 'submitted'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : questionStatus === 'skipped'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : i === currentQuestion
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                aria-label={`Go to question ${questionId} (${questionStatus})`}
              >
                {questionId}
              </button>
            )
          })}
        </div>
        
        {/* Progress Summary */}
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              {quizProgress.submittedQuestions + quizProgress.answeredQuestions} of 10 questions completed
            </span>
            {isQuizCompleted && (
              <span className="text-green-600 font-medium">
                ✓ Quiz ready to complete
              </span>
            )}
          </div>
          {quizProgress.skippedQuestions > 0 && (
            <div className="mt-1 text-orange-600">
              {quizProgress.skippedQuestions} questions skipped
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        totalQuestions={22}
        onQuestionSelect={handleGoToQuestion}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
      />
    </div>
  )
}

export default Quiz 