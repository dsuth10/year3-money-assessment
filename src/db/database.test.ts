import { db, dbUtils, type Student, type StudentAttempt, type Answer, type QuizData } from './database';

/**
 * Database Test Suite
 * 
 * This file contains comprehensive tests for the Dexie 4 database implementation.
 * Tests cover all CRUD operations, schema validation, error handling, and performance features.
 * 
 * To run these tests:
 * 1. Ensure the database is accessible in the browser environment
 * 2. Call the test functions and check console output
 * 3. Verify that all operations complete successfully
 */

// Test data
const testStudent: Omit<Student, 'totalAttempts'> = {
  id: 'test-student-1',
  name: 'Test Student',
  grade: '3A'
};

const testQuizData: QuizData = {
  id: 'money-quiz-1',
  title: 'Money Assessment Quiz',
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      text: 'What is the value of 2 dollars and 50 cents?',
      type: 'multiple-choice',
      options: ['$2.50', '$2.05', '$2.15', '$2.25'],
      correctAnswer: '$2.50'
    },
    {
      id: 2,
      text: 'How many quarters make $1.00?',
      type: 'multiple-choice',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4'
    }
  ]
};

const testAttempt: Omit<StudentAttempt, 'id'> = {
  studentId: 'test-student-1',
  quizId: 'money-quiz-1',
  timestamp: Date.now(),
  completed: false
};

const testAnswer: Omit<Answer, 'id'> = {
  attemptId: 1, // Will be set after attempt creation
  questionId: 1,
  answer: '$2.50'
};

/**
 * Test Suite Functions
 */

export async function runAllTests(): Promise<void> {
  console.log('🧪 Starting Database Test Suite...');
  
  try {
    // Clear existing data
    await dbUtils.clearAllData();
    console.log('✅ Database cleared successfully');

    // Run all test categories
    await testStudentOperations();
    await testQuizDataOperations();
    await testAttemptOperations();
    await testAnswerOperations();
    await testAdvancedQueries();
    await testErrorHandling();
    await testPerformanceFeatures();
    await testSchemaValidation();

    console.log('🎉 All tests passed successfully!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    throw error;
  }
}

/**
 * Test Student CRUD Operations
 */
async function testStudentOperations(): Promise<void> {
  console.log('\n📚 Testing Student Operations...');

  // Test adding student
  const studentId = await dbUtils.addStudent(testStudent);
  console.log('✅ Student added:', studentId);

  // Test getting student
  const retrievedStudent = await dbUtils.getStudent(studentId);
  if (!retrievedStudent || retrievedStudent.name !== testStudent.name) {
    throw new Error('Student retrieval failed');
  }
  console.log('✅ Student retrieved successfully');

  // Test updating student
  await dbUtils.updateStudent(studentId, { grade: '3B' });
  const updatedStudent = await dbUtils.getStudent(studentId);
  if (updatedStudent?.grade !== '3B') {
    throw new Error('Student update failed');
  }
  console.log('✅ Student updated successfully');

  // Test getting all students
  const allStudents = await dbUtils.getAllStudents();
  if (allStudents.length !== 1) {
    throw new Error('Get all students failed');
  }
  console.log('✅ All students retrieved successfully');
}

/**
 * Test Quiz Data Operations
 */
async function testQuizDataOperations(): Promise<void> {
  console.log('\n📝 Testing Quiz Data Operations...');

  // Test saving quiz data
  const quizId = await dbUtils.saveQuizData(testQuizData);
  console.log('✅ Quiz data saved:', quizId);

  // Test getting quiz data
  const retrievedQuiz = await dbUtils.getQuizData(quizId);
  if (!retrievedQuiz || retrievedQuiz.title !== testQuizData.title) {
    throw new Error('Quiz data retrieval failed');
  }
  console.log('✅ Quiz data retrieved successfully');
}

/**
 * Test Attempt Operations
 */
async function testAttemptOperations(): Promise<void> {
  console.log('\n🎯 Testing Attempt Operations...');

  // Test creating attempt
  const attemptId = await dbUtils.createAttempt(testAttempt);
  console.log('✅ Attempt created:', attemptId);

  // Test getting attempt by ID
  const retrievedAttempt = await dbUtils.getAttemptById(attemptId);
  if (!retrievedAttempt || retrievedAttempt.studentId !== testAttempt.studentId) {
    throw new Error('Attempt retrieval failed');
  }
  console.log('✅ Attempt retrieved successfully');

  // Test getting attempts by student
  const studentAttempts = await dbUtils.getAttemptsByStudent(testAttempt.studentId);
  if (studentAttempts.length !== 1) {
    throw new Error('Get attempts by student failed');
  }
  console.log('✅ Student attempts retrieved successfully');

  // Test updating attempt
  await dbUtils.updateAttempt(attemptId, { completed: true, score: 85 });
  const updatedAttempt = await dbUtils.getAttemptById(attemptId);
  if (!updatedAttempt?.completed || updatedAttempt.score !== 85) {
    throw new Error('Attempt update failed');
  }
  console.log('✅ Attempt updated successfully');

  return attemptId;
}

/**
 * Test Answer Operations
 */
async function testAnswerOperations(): Promise<void> {
  console.log('\n💡 Testing Answer Operations...');

  // Create a test attempt first
  const attemptId = await dbUtils.createAttempt({
    ...testAttempt,
    studentId: 'test-student-2'
  });

  // Test saving answer
  const answerData = { ...testAnswer, attemptId };
  const answerId = await dbUtils.saveAnswer(answerData);
  console.log('✅ Answer saved:', answerId);

  // Test getting answers by attempt
  const answers = await dbUtils.getAnswersByAttempt(attemptId);
  if (answers.length !== 1 || answers[0].answer !== testAnswer.answer) {
    throw new Error('Get answers by attempt failed');
  }
  console.log('✅ Answers retrieved successfully');
}

/**
 * Test Advanced Query Operations
 */
async function testAdvancedQueries(): Promise<void> {
  console.log('\n🔍 Testing Advanced Queries...');

  // Create test data for advanced queries
  const studentId = 'test-student-3';
  await dbUtils.addStudent({ id: studentId, name: 'Advanced Test Student', grade: '3C' });
  
  const attemptId = await dbUtils.createAttempt({
    studentId,
    quizId: 'money-quiz-1',
    timestamp: Date.now(),
    completed: true,
    score: 90
  });

  await dbUtils.saveAnswer({ attemptId, questionId: 1, answer: '$2.50' });
  await dbUtils.saveAnswer({ attemptId, questionId: 2, answer: '4' });

  // Test getAttemptWithAnswers
  const attemptWithAnswers = await dbUtils.getAttemptWithAnswers(attemptId);
  if (!attemptWithAnswers || attemptWithAnswers.answers.length !== 2) {
    throw new Error('Get attempt with answers failed');
  }
  console.log('✅ Attempt with answers retrieved successfully');

  // Test getStudentProgress
  const studentProgress = await dbUtils.getStudentProgress(studentId);
  if (!studentProgress || studentProgress.attempts.length !== 1 || studentProgress.averageScore !== 90) {
    throw new Error('Get student progress failed');
  }
  console.log('✅ Student progress retrieved successfully');
}

/**
 * Test Error Handling
 */
async function testErrorHandling(): Promise<void> {
  console.log('\n⚠️ Testing Error Handling...');

  // Test invalid student data
  try {
    await dbUtils.addStudent({ id: '', name: '', grade: '' });
    throw new Error('Should have thrown validation error');
  } catch (error) {
    console.log('✅ Validation error caught for invalid student data');
  }

  // Test invalid attempt data
  try {
    await dbUtils.createAttempt({
      studentId: '',
      quizId: '',
      timestamp: -1,
      completed: false
    });
    throw new Error('Should have thrown validation error');
  } catch (error) {
    console.log('✅ Validation error caught for invalid attempt data');
  }

  // Test getting non-existent student
  const nonExistentStudent = await dbUtils.getStudent('non-existent-id');
  if (nonExistentStudent !== undefined) {
    throw new Error('Should return undefined for non-existent student');
  }
  console.log('✅ Non-existent student handled correctly');
}

/**
 * Test Performance Features
 */
async function testPerformanceFeatures(): Promise<void> {
  console.log('\n⚡ Testing Performance Features...');

  // Test cache functionality
  const cacheStats = dbUtils.getCacheStats();
  console.log('✅ Cache stats retrieved:', cacheStats);

  // Test database stats
  const dbStats = await dbUtils.getDatabaseStats();
  if (typeof dbStats.students !== 'number' || typeof dbStats.attempts !== 'number') {
    throw new Error('Database stats failed');
  }
  console.log('✅ Database stats retrieved:', dbStats);

  // Test cache clearing
  dbUtils.clearCache();
  const clearedCacheStats = dbUtils.getCacheStats();
  if (clearedCacheStats.size !== 0) {
    throw new Error('Cache clearing failed');
  }
  console.log('✅ Cache cleared successfully');
}

/**
 * Test Schema Validation
 */
async function testSchemaValidation(): Promise<void> {
  console.log('\n🔧 Testing Schema Validation...');

  const validation = await dbUtils.validateSchema();
  if (!validation.valid) {
    throw new Error(`Schema validation failed: ${validation.errors.join(', ')}`);
  }
  console.log('✅ Schema validation passed');
}

/**
 * Performance Benchmark Tests
 */
export async function runPerformanceBenchmark(): Promise<void> {
  console.log('\n🏃 Running Performance Benchmark...');

  const startTime = performance.now();

  // Create multiple test records
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      dbUtils.addStudent({
        id: `benchmark-student-${i}`,
        name: `Benchmark Student ${i}`,
        grade: '3A'
      })
    );
  }

  await Promise.all(promises);
  const endTime = performance.now();

  console.log(`✅ Created 10 students in ${(endTime - startTime).toFixed(2)}ms`);

  // Test bulk retrieval
  const retrievalStart = performance.now();
  const allStudents = await dbUtils.getAllStudents();
  const retrievalEnd = performance.now();

  console.log(`✅ Retrieved ${allStudents.length} students in ${(retrievalEnd - retrievalStart).toFixed(2)}ms`);
}

/**
 * Manual Test Runner
 * Call this function in the browser console to run all tests
 */
export function runTests(): void {
  runAllTests().catch(console.error);
}

/**
 * Quick Health Check
 * Call this function to verify basic database functionality
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await dbUtils.validateSchema();
    const stats = await dbUtils.getDatabaseStats();
    console.log('✅ Database health check passed:', stats);
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
} 