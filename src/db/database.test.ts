import { db, dbUtils, type Answer, type StudentAttempt } from './database';

/**
 * Database Schema Migration and Status Persistence Tests
 * 
 * These tests verify that the updated Dexie schema correctly handles:
 * - Schema version migration from v1 to v2
 * - Status field persistence and retrieval
 * - Backward compatibility with existing data
 * - New status-based query functionality
 */

describe('Database Schema Migration and Status Persistence', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await dbUtils.clearAllData();
  });

  afterAll(async () => {
    // Clean up after all tests
    await dbUtils.clearAllData();
  });

  describe('Schema Migration', () => {
    test('should migrate existing answers to include status field', async () => {
      // Create a test attempt
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Save an answer without status (simulating old schema)
      const answerId = await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'test answer'
      });

      // Verify the answer was saved with default status
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      expect(answers).toHaveLength(1);
      expect(answers[0].status).toBe('answered'); // Default status from migration
      expect(answers[0].answer).toBe('test answer');
    });

    test('should handle new answers with explicit status', async () => {
      // Create a test attempt
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Save answers with different statuses
      await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'skipped answer',
        status: 'skipped'
      });

      await dbUtils.saveAnswer({
        attemptId,
        questionId: 2,
        answer: 'submitted answer',
        status: 'submitted'
      });

      // Verify answers were saved with correct statuses
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      expect(answers).toHaveLength(2);
      
      const skippedAnswer = answers.find(a => a.questionId === 1);
      const submittedAnswer = answers.find(a => a.questionId === 2);
      
      expect(skippedAnswer?.status).toBe('skipped');
      expect(submittedAnswer?.status).toBe('submitted');
    });
  });

  describe('Status Persistence', () => {
    test('should persist and retrieve status with timestamps', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      const timestamp = Date.now();

      // Save answer with status and timestamp
      await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'test answer',
        status: 'submitted'
      });

      // Update status with timestamp
      await dbUtils.updateAnswerStatus(attemptId, 1, 'submitted', timestamp);

      // Verify status and timestamp were persisted
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      const answer = answers.find(a => a.questionId === 1);
      
      expect(answer?.status).toBe('submitted');
      expect(answer?.submittedAt).toBe(timestamp);
    });

    test('should handle status updates correctly', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Save initial answer
      await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'initial answer',
        status: 'pending'
      });

      // Update status to skipped
      const skipTimestamp = Date.now();
      await dbUtils.updateAnswerStatus(attemptId, 1, 'skipped', skipTimestamp);

      // Update status to submitted
      const submitTimestamp = Date.now();
      await dbUtils.updateAnswerStatus(attemptId, 1, 'submitted', submitTimestamp);

      // Verify final status and timestamps
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      const answer = answers.find(a => a.questionId === 1);
      
      expect(answer?.status).toBe('submitted');
      expect(answer?.submittedAt).toBe(submitTimestamp);
    });
  });

  describe('Status-based Queries', () => {
    test('should query answers by status', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Save answers with different statuses
      await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'skipped answer',
        status: 'skipped'
      });

      await dbUtils.saveAnswer({
        attemptId,
        questionId: 2,
        answer: 'submitted answer',
        status: 'submitted'
      });

      await dbUtils.saveAnswer({
        attemptId,
        questionId: 3,
        answer: 'answered answer',
        status: 'answered'
      });

      // Query by status
      const skippedAnswers = await dbUtils.getAnswersByStatus(attemptId, 'skipped');
      const submittedAnswers = await dbUtils.getAnswersByStatus(attemptId, 'submitted');
      const answeredAnswers = await dbUtils.getAnswersByStatus(attemptId, 'answered');

      expect(skippedAnswers).toHaveLength(1);
      expect(submittedAnswers).toHaveLength(1);
      expect(answeredAnswers).toHaveLength(1);

      expect(skippedAnswers[0].questionId).toBe(1);
      expect(submittedAnswers[0].questionId).toBe(2);
      expect(answeredAnswers[0].questionId).toBe(3);
    });

    test('should return empty array for non-existent status', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      const pendingAnswers = await dbUtils.getAnswersByStatus(attemptId, 'pending');
      expect(pendingAnswers).toHaveLength(0);
    });
  });

  describe('Backward Compatibility', () => {
    test('should handle existing data without status field', async () => {
      // This test simulates loading data from an older schema version
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Simulate old data without status field
      await db.answers.add({
        attemptId,
        questionId: 1,
        answer: 'old answer'
        // No status field - should be handled by migration
      });

      // Verify the data can be retrieved and has default status
      const answers = await dbUtils.getAnswersByAttempt(attemptId);
      expect(answers).toHaveLength(1);
      expect(answers[0].status).toBe('answered'); // Default from migration
    });

    test('should maintain data integrity during migration', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Create multiple answers with different statuses
      const answers = [
        { questionId: 1, answer: 'answer 1', status: 'pending' as const },
        { questionId: 2, answer: 'answer 2', status: 'submitted' as const },
        { questionId: 3, answer: 'answer 3', status: 'skipped' as const },
        { questionId: 4, answer: 'answer 4', status: 'answered' as const }
      ];

      for (const answer of answers) {
        await dbUtils.saveAnswer({
          attemptId,
          ...answer
        });
      }

      // Verify all answers are preserved with correct statuses
      const retrievedAnswers = await dbUtils.getAnswersByAttempt(attemptId);
      expect(retrievedAnswers).toHaveLength(4);

      for (const answer of answers) {
        const retrieved = retrievedAnswers.find(a => a.questionId === answer.questionId);
        expect(retrieved?.status).toBe(answer.status);
        expect(retrieved?.answer).toBe(answer.answer);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid status values', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      // Try to save answer with invalid status
      await expect(dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'test answer',
        status: 'invalid' as any
      })).rejects.toThrow('Answer status must be one of: pending, skipped, submitted, answered');
    });

    test('should handle database errors gracefully', async () => {
      // Test with invalid attempt ID
      await expect(dbUtils.updateAnswerStatus(999, 1, 'submitted'))
        .rejects.toThrow();
    });
  });

  describe('Performance and Caching', () => {
    test('should cache status-based queries', async () => {
      const attemptId = await dbUtils.createAttempt({
        studentId: 'test-student',
        quizId: 'test-quiz',
        timestamp: Date.now(),
        completed: false
      });

      await dbUtils.saveAnswer({
        attemptId,
        questionId: 1,
        answer: 'test answer',
        status: 'submitted'
      });

      // First query should cache
      const firstQuery = await dbUtils.getAnswersByStatus(attemptId, 'submitted');
      expect(firstQuery).toHaveLength(1);

      // Second query should use cache
      const secondQuery = await dbUtils.getAnswersByStatus(attemptId, 'submitted');
      expect(secondQuery).toHaveLength(1);

      // Verify cache stats
      const cacheStats = dbUtils.getCacheStats();
      expect(cacheStats.size).toBeGreaterThan(0);
    });
  });
}); 