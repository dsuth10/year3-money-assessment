import { useState } from 'react'
import { useStudentStore } from '../stores/studentStore'

function Students() {
  const { students, addStudent, removeStudent } = useStudentStore()
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', grade: 'Year 3' })

  const handleAddStudent = () => {
    if (newStudent.name.trim()) {
      addStudent({
        id: `student-${Date.now()}`,
        name: newStudent.name.trim(),
        grade: newStudent.grade,
      })
      setNewStudent({ name: '', grade: 'Year 3' })
      setIsAddingStudent(false)
    }
  }

  const handleRemoveStudent = (studentId: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      removeStudent(studentId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Student Management</h2>
            <button
              onClick={() => setIsAddingStudent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Student
            </button>
          </div>

          {isAddingStudent && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Add New Student</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="student-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="student-name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label htmlFor="student-grade" className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    id="student-grade"
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                    <option value="Year 6">Year 6</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddStudent}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Student
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingStudent(false)
                      setNewStudent({ name: '', grade: 'Year 3' })
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students registered yet.</p>
            ) : (
              students.map(student => (
                <div
                  key={student.id}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                    <p className="text-sm text-gray-500">
                      {student.totalAttempts} quiz attempts
                      {student.lastAttempt && (
                        <span> • Last attempt: {new Date(student.lastAttempt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {students.reduce((sum, student) => sum + student.totalAttempts, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Attempts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {students.length > 0 
                  ? Math.round(students.reduce((sum, student) => sum + student.totalAttempts, 0) / students.length * 10) / 10
                  : 0
                }
              </p>
              <p className="text-sm text-gray-500">Average Attempts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Students 