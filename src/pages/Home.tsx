import { useQuizStore } from '../stores/quizStore'
import { useStudentStore } from '../stores/studentStore'
import CurrencyTest from '../components/CurrencyTest'
import DraggableCurrencyTest from '../components/currency/DraggableCurrencyTest'
import DragAndDropTest from '../components/currency/DragAndDropTest'
import AccessibilityTest from '../components/currency/AccessibilityTest'

function Home() {
  const { isQuizActive, getProgress } = useQuizStore()
  const { students } = useStudentStore()

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Welcome to Year 3 Money Assessment
          </h2>
          <p className="text-gray-600 mb-6">
            This application helps Year 3 students practice their money skills through interactive quizzes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Students</h3>
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-blue-700">Registered students</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Quiz Status</h3>
              <p className="text-2xl font-bold text-green-600">
                {isQuizActive ? 'Active' : 'Ready'}
              </p>
              <p className="text-sm text-green-700">
                {isQuizActive ? 'Quiz in progress' : 'No active quiz'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Progress</h3>
              <p className="text-2xl font-bold text-purple-600">{getProgress()}</p>
              <p className="text-sm text-purple-700">Questions answered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Start New Quiz
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              View Student Progress
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Manage Students
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <CurrencyTest />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <DraggableCurrencyTest />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <DragAndDropTest />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <AccessibilityTest />
        </div>
      </div>
    </div>
  )
}

export default Home 