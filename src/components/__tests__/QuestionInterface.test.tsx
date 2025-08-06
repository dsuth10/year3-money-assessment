import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuestionInterface from '../QuestionInterface';
import QuestionInterfaceContainer from '../QuestionInterfaceContainer';

// Mock the stores
vi.mock('../../stores/quizStore', () => ({
  useQuizStore: vi.fn(() => ({
    setCurrentQuestion: vi.fn(),
    setAnswer: vi.fn(),
    getAnswer: vi.fn(() => null),
    skipQuestion: vi.fn(),
    submitQuestion: vi.fn(),
    isLoading: false,
    error: null
  }))
}));

vi.mock('../../stores/quizSelectors', () => ({
  useCurrentQuestion: vi.fn(() => 0),
  useQuestionStatus: vi.fn(() => 'pending')
}));

// Mock the child components
vi.mock('../QuestionActionButtons', () => ({
  default: ({ questionId, skipAriaLabel, submitAriaLabel }: any) => (
    <div data-testid="question-action-buttons">
      <button data-testid="skip-button" aria-label={skipAriaLabel} tabIndex={0}>
        Skip
      </button>
      <button data-testid="submit-button" aria-label={submitAriaLabel} tabIndex={0}>
        Submit
      </button>
    </div>
  )
}));

vi.mock('../BottomNavigation', () => ({
  default: ({ totalQuestions, ariaLabel, onQuestionSelect }: any) => (
    <nav data-testid="bottom-navigation" aria-label={ariaLabel}>
      <div>Navigation for {totalQuestions} questions</div>
      <button onClick={() => onQuestionSelect?.(1)}>Next</button>
    </nav>
  )
}));

// Mock the DragDropQuestionInterface component
vi.mock('../questions/DragDropQuestionInterface', () => ({
  default: ({ question, availableCurrency, dropZones }: any) => (
    <div data-testid="drag-drop-interface">
      <div>Drag and Drop Interface</div>
      <div>Question: {question.title}</div>
      <div>Currency Items: {availableCurrency?.length || 0}</div>
      <div>Drop Zones: {dropZones?.length || 0}</div>
    </div>
  )
}));

describe('QuestionInterface', () => {
  const mockQuestion = {
    id: 1,
    title: 'Test Question',
    prompt: 'What is the answer?',
    type: 'multiple-choice'
  };

  const mockCurrency = [
    {
      id: '1',
      value: 1.00,
      name: 'One Dollar',
      type: 'note' as const,
      image: 'dollar.png',
      imagePath: '/static/currency/dollar.png'
    }
  ];

  const mockDropZones = [
    {
      id: 'zone1',
      title: 'Drop Zone 1',
      description: 'Drop items here',
      targetValue: 5.00,
      acceptedTypes: ['currency-item']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Presentational Component (QuestionInterface)', () => {
    it('renders question title and counter in header', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      expect(screen.getByText('Test Question')).toBeInTheDocument();
      expect(screen.getByText('Question')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders question prompt', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      expect(screen.getByText('What is the answer?')).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={true}
          error={null}
        />
      );

      expect(screen.getByText('Loading question...')).toBeInTheDocument();
    });

    it('shows error state when error is provided', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error="Test error message"
        />
      );

      expect(screen.getByText('Error loading question')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('renders action buttons with correct props', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      const actionButtons = screen.getByTestId('question-action-buttons');
      expect(actionButtons).toBeInTheDocument();

      const skipButton = screen.getByTestId('skip-button');
      const submitButton = screen.getByTestId('submit-button');

      expect(skipButton).toHaveAttribute('aria-label', 'Skip question 1');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit answer for question 1');
    });

    it('renders bottom navigation with correct props', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      const navigation = screen.getByTestId('bottom-navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveAttribute('aria-label', 'Quiz question navigation');
    });

    it('handles custom content props', () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;
      const customMain = <div data-testid="custom-main">Custom Main</div>;
      const customSidebar = <div data-testid="custom-sidebar">Custom Sidebar</div>;

      render(
        <QuestionInterface
          question={mockQuestion}
          headerContent={customHeader}
          mainContent={customMain}
          sidebarContent={customSidebar}
          isLoading={false}
          error={null}
        />
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-main')).toBeInTheDocument();
      expect(screen.getByTestId('custom-sidebar')).toBeInTheDocument();
    });

    it('renders drag-and-drop interface for drag-drop question types', () => {
      const dragDropQuestion = {
        ...mockQuestion,
        type: 'drag-drop'
      };

      render(
        <QuestionInterface
          question={dragDropQuestion}
          availableCurrency={mockCurrency}
          dropZones={mockDropZones}
          isLoading={false}
          error={null}
        />
      );

      expect(screen.getByTestId('drag-drop-interface')).toBeInTheDocument();
    });
  });

  describe('Container Component (QuestionInterfaceContainer)', () => {
    it('passes enhanced question data to presentational component', () => {
      render(
        <QuestionInterfaceContainer
          question={mockQuestion}
          availableCurrency={mockCurrency}
          dropZones={mockDropZones}
        />
      );

      // The container should enhance the question with status and answer info
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });

    it('handles question navigation through store', async () => {
      const mockSetCurrentQuestion = vi.fn();
      const { useQuizStore } = await import('../../stores/quizStore');
      (useQuizStore as any).mockReturnValue({
        setCurrentQuestion: mockSetCurrentQuestion,
        setAnswer: vi.fn(),
        getAnswer: vi.fn(() => null),
        skipQuestion: vi.fn(),
        submitQuestion: vi.fn(),
        isLoading: false,
        error: null
      });

      render(
        <QuestionInterfaceContainer
          question={mockQuestion}
          availableCurrency={mockCurrency}
          dropZones={mockDropZones}
        />
      );

      // Trigger navigation through bottom navigation
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockSetCurrentQuestion).toHaveBeenCalledWith(1);
      });
    });

    it('allows external override of loading and error states', () => {
      render(
        <QuestionInterfaceContainer
          question={mockQuestion}
          availableCurrency={mockCurrency}
          dropZones={mockDropZones}
          isLoading={false}
          error="External error"
        />
      );

      expect(screen.getByText('Error loading question')).toBeInTheDocument();
      expect(screen.getByText('External error')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      // Check header structure
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      // Check main content
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Check navigation
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(
        <QuestionInterface
          question={mockQuestion}
          isLoading={false}
          error={null}
        />
      );

      const skipButton = screen.getByTestId('skip-button');
      const submitButton = screen.getByTestId('submit-button');

      expect(skipButton).toHaveAttribute('tabIndex', '0');
      expect(submitButton).toHaveAttribute('tabIndex', '0');
    });
  });
}); 