import { useQuizStore } from '../stores/quizStore'
import { useStudentStore } from '../stores/studentStore'

function Quiz() {
  const { 
    isQuizActive, 
    currentQuestion, 
    answers, 
    setAnswer, 
    setCurrentQuestion, 
    startQuiz, 
    resetQuiz
  } = useQuizStore()
  
  const { students, currentStudent, setCurrentStudent } = useStudentStore()

  const handleStartQuiz = (studentId: string) => {
    startQuiz('money-quiz-1', studentId)
    const student = students.find(s => s.id === studentId)
    if (student) {
      setCurrentStudent(student)
    }
  }

  const handleAnswerQuestion = (questionId: number, answer: string) => {
    setAnswer(questionId, answer)
    setCurrentQuestion(currentQuestion + 1)
  }

  const handleResetQuiz = () => {
    resetQuiz()
    setCurrentStudent(null)
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
        <button
          onClick={handleResetQuiz}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          End Quiz
        </button>
      </div>

      {currentStudent && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">Current Student</h3>
          <p className="text-blue-700">{currentStudent.name} - {currentStudent.grade}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Question {currentQuestion + 1}</h3>
        <p className="text-gray-600 mb-4">
          This is a placeholder question. The actual quiz questions will be implemented in Task 5.
        </p>
        
        <div className="space-y-2">
          <button
            onClick={() => handleAnswerQuestion(currentQuestion, 'A')}
            className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            A) $1.50
          </button>
          <button
            onClick={() => handleAnswerQuestion(currentQuestion, 'B')}
            className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            B) $2.00
          </button>
          <button
            onClick={() => handleAnswerQuestion(currentQuestion, 'C')}
            className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            C) $2.50
          </button>
          <button
            onClick={() => handleAnswerQuestion(currentQuestion, 'D')}
            className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            D) $3.00
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
        <div className="flex space-x-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                answers[i] 
                  ? 'bg-green-500 text-white' 
                  : i < currentQuestion 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Quiz 