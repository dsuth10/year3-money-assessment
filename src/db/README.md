# Database Implementation Documentation

## Overview

This module implements a Dexie 4 IndexedDB database for the Year 3 Money Assessment application. The database provides persistent storage for student information, quiz attempts, answers, and quiz data with comprehensive CRUD operations, validation, caching, and performance optimizations.

## Architecture

### Database Schema

The database consists of four main tables:

1. **students** - Student information and progress tracking
2. **studentAttempts** - Quiz attempt records with timestamps and completion status
3. **answers** - Individual question answers linked to attempts
4. **quizData** - Quiz definitions and question structures

### Key Features

- **Type Safety**: Full TypeScript integration with type-safe operations
- **Runtime Validation**: Comprehensive data validation for all operations
- **Caching**: In-memory caching for frequently accessed data
- **Performance Monitoring**: Built-in performance tracking and statistics
- **Error Handling**: Robust error handling with detailed error messages
- **Schema Versioning**: Support for future database migrations

## API Reference

### Database Instance

```typescript
import { db, dbUtils } from './database';

// Access the singleton database instance
const database = db;

// Use utility functions for common operations
const students = await dbUtils.getAllStudents();
```

### Student Operations

#### Add Student
```typescript
const studentId = await dbUtils.addStudent({
  id: 'student-1',
  name: 'John Doe',
  grade: '3A'
});
```

#### Get Student
```typescript
const student = await dbUtils.getStudent('student-1');
```

#### Update Student
```typescript
await dbUtils.updateStudent('student-1', {
  grade: '3B',
  totalAttempts: 5
});
```

#### Get All Students
```typescript
const allStudents = await dbUtils.getAllStudents();
```

### Quiz Attempt Operations

#### Create Attempt
```typescript
const attemptId = await dbUtils.createAttempt({
  studentId: 'student-1',
  quizId: 'money-quiz-1',
  timestamp: Date.now(),
  completed: false
});
```

#### Get Attempt
```typescript
const attempt = await dbUtils.getAttemptById(attemptId);
```

#### Update Attempt
```typescript
await dbUtils.updateAttempt(attemptId, {
  completed: true,
  score: 85
});
```

#### Get Attempts by Student
```typescript
const studentAttempts = await dbUtils.getAttemptsByStudent('student-1');
```

### Answer Operations

#### Save Answer
```typescript
const answerId = await dbUtils.saveAnswer({
  attemptId: 1,
  questionId: 1,
  answer: '$2.50'
});
```

#### Get Answers by Attempt
```typescript
const answers = await dbUtils.getAnswersByAttempt(attemptId);
```

### Quiz Data Operations

#### Save Quiz Data
```typescript
const quizId = await dbUtils.saveQuizData({
  id: 'money-quiz-1',
  title: 'Money Assessment Quiz',
  totalQuestions: 5,
  questions: [...]
});
```

#### Get Quiz Data
```typescript
const quizData = await dbUtils.getQuizData('money-quiz-1');
```

### Advanced Queries

#### Get Attempt with Answers
```typescript
const attemptWithAnswers = await dbUtils.getAttemptWithAnswers(attemptId);
// Returns: { attempt: StudentAttempt, answers: Answer[] }
```

#### Get Student Progress
```typescript
const progress = await dbUtils.getStudentProgress('student-1');
// Returns: { student: Student, attempts: StudentAttempt[], totalScore: number, averageScore: number }
```

### Utility Functions

#### Database Statistics
```typescript
const stats = await dbUtils.getDatabaseStats();
// Returns: { students: number, attempts: number, answers: number, quizzes: number, averageQueryTime: number, cacheHitRate: number }
```

#### Cache Management
```typescript
// Get cache statistics
const cacheStats = dbUtils.getCacheStats();

// Clear cache
dbUtils.clearCache();
```

#### Schema Validation
```typescript
const validation = await dbUtils.validateSchema();
// Returns: { valid: boolean, errors: string[] }
```

#### Clear All Data
```typescript
await dbUtils.clearAllData();
```

## Data Models

### Student
```typescript
interface Student {
  id: string;
  name: string;
  grade: string;
  lastAttempt?: Date;
  totalAttempts: number;
}
```

### StudentAttempt
```typescript
interface StudentAttempt {
  id?: number;
  studentId: string;
  quizId: string;
  timestamp: number;
  completed: boolean;
  score?: number;
}
```

### Answer
```typescript
interface Answer {
  id?: number;
  attemptId: number;
  questionId: number;
  answer: string;
  isCorrect?: boolean;
}
```

### QuizData
```typescript
interface QuizData {
  id: string;
  title: string;
  questions: Question[];
  totalQuestions: number;
}
```

### Question
```typescript
interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'drag-drop' | 'text';
  options?: string[];
  correctAnswer: string;
  currencyAmount?: number;
}
```

## Performance Features

### Caching
The database implements an in-memory cache with a 5-minute TTL for frequently accessed data:

- Student records
- Quiz data
- Attempt records
- Answer collections

### Indexes
Optimized indexes for common query patterns:

- `[studentId+quizId]` - Student's quiz attempts
- `[attemptId+questionId]` - Attempt's answers
- `timestamp` - Chronological queries
- `completed` - Filter by completion status

### Atomic Operations
Critical operations use database transactions to ensure data consistency:

- Creating attempts and updating student attempt counts
- Clearing all data
- Bulk operations

## Error Handling

All database operations include comprehensive error handling:

```typescript
try {
  const student = await dbUtils.getStudent('student-1');
} catch (error) {
  console.error('Database operation failed:', error);
  // Handle error appropriately
}
```

### Validation Errors
The database validates all input data:

- Required fields must be present
- Data types must be correct
- Numeric values must be valid
- Arrays must not be empty

## Testing

### Running Tests
```typescript
import { runTests, healthCheck } from './database.test';

// Run comprehensive test suite
runTests();

// Quick health check
const isHealthy = await healthCheck();
```

### Test Coverage
The test suite covers:

- All CRUD operations
- Error handling and validation
- Performance features
- Schema validation
- Advanced queries
- Cache functionality

## Best Practices

### 1. Use Async/Await
Always use async/await for database operations:

```typescript
// ✅ Good
const students = await dbUtils.getAllStudents();

// ❌ Bad
dbUtils.getAllStudents().then(students => {
  // handle students
});
```

### 2. Handle Errors
Always wrap database operations in try/catch:

```typescript
try {
  await dbUtils.addStudent(student);
} catch (error) {
  console.error('Failed to add student:', error);
  // Show user-friendly error message
}
```

### 3. Use Transactions for Related Operations
When updating related data, use transactions:

```typescript
await db.transaction('rw', [db.students, db.studentAttempts], async () => {
  // Multiple related operations
});
```

### 4. Leverage Caching
The database automatically caches frequently accessed data. Clear cache when data changes:

```typescript
await dbUtils.addStudent(student);
// Cache is automatically invalidated
```

### 5. Monitor Performance
Use the built-in performance monitoring:

```typescript
const stats = await dbUtils.getDatabaseStats();
console.log('Average query time:', stats.averageQueryTime);
```

## Migration Guide

### Schema Versioning
The database uses Dexie's versioning system for schema migrations:

```typescript
// Current version (v1)
this.version(1).stores({
  studentAttempts: "++id, studentId, quizId, timestamp, completed, [studentId+quizId]",
  // ... other tables
});

// Future version (v2) - uncomment when needed
// this.version(2).stores({
//   studentAttempts: "++id, studentId, quizId, timestamp, completed, score, [studentId+quizId], [studentId+timestamp]",
//   // Add new fields or indexes
// });
```

### Adding New Fields
1. Update the TypeScript interfaces
2. Add validation for new fields
3. Update the schema version
4. Test the migration

### Adding New Tables
1. Define the table interface
2. Add the table to the database class
3. Update the schema version
4. Add CRUD operations to dbUtils
5. Update tests

## Troubleshooting

### Common Issues

#### 1. Database Not Initialized
```typescript
// Check if database is accessible
const isHealthy = await healthCheck();
if (!isHealthy) {
  console.error('Database not properly initialized');
}
```

#### 2. Validation Errors
Check the error message for specific validation failures:

```typescript
try {
  await dbUtils.addStudent(invalidStudent);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

#### 3. Performance Issues
Monitor database performance:

```typescript
const stats = await dbUtils.getDatabaseStats();
if (stats.averageQueryTime > 100) {
  console.warn('Slow database performance detected');
}
```

#### 4. Cache Issues
Clear cache if data seems stale:

```typescript
dbUtils.clearCache();
```

## Integration with React Components

### Using with Zustand Stores
The database integrates seamlessly with Zustand stores:

```typescript
// In store
const addStudent = async (student) => {
  try {
    await dbUtils.addStudent(student);
    await loadStudents(); // Refresh store
  } catch (error) {
    setError(error.message);
  }
};
```

### Using with React Components
```typescript
import { useEffect, useState } from 'react';
import { dbUtils } from '../db/database';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await dbUtils.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Render component
}
```

## Security Considerations

### Data Validation
All input data is validated before storage:

- Required fields are checked
- Data types are verified
- Numeric ranges are validated
- Array contents are validated

### Error Handling
Sensitive error information is not exposed to users:

```typescript
try {
  await dbUtils.addStudent(student);
} catch (error) {
  // Log full error for debugging
  console.error('Database error:', error);
  
  // Show user-friendly message
  setError('Failed to add student. Please try again.');
}
```

### Data Integrity
The database ensures data integrity through:

- Foreign key relationships
- Atomic transactions
- Validation constraints
- Type safety

## Future Enhancements

### Planned Features
1. **Offline Support**: Enhanced offline capabilities with sync
2. **Data Export**: Export functionality for backup and analysis
3. **Advanced Analytics**: Built-in analytics and reporting
4. **Real-time Sync**: Real-time synchronization with backend
5. **Advanced Caching**: More sophisticated caching strategies

### Performance Optimizations
1. **Lazy Loading**: Implement lazy loading for large datasets
2. **Pagination**: Add pagination support for large result sets
3. **Background Sync**: Background synchronization capabilities
4. **Compression**: Data compression for storage efficiency

## Contributing

When contributing to the database implementation:

1. **Follow TypeScript conventions** - Use proper types and interfaces
2. **Add comprehensive tests** - Test all new functionality
3. **Update documentation** - Keep documentation current
4. **Follow error handling patterns** - Use consistent error handling
5. **Consider performance** - Optimize for performance and memory usage
6. **Validate data** - Always validate input data
7. **Handle edge cases** - Consider and handle edge cases

## License

This database implementation is part of the Year 3 Money Assessment application and follows the same licensing terms as the main project. 