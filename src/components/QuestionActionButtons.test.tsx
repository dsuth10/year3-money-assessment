import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionActionButtons from './QuestionActionButtons';

// Mock the quiz store
jest.mock('../stores/quizStore', () => ({
  useQuizStore: () => ({
    skipQuestion: jest.fn(),
    submitQuestion: jest.fn(),
    isLoading: false
  })
}));

describe('QuestionActionButtons', () => {
  const defaultProps = {
    questionId: 1
  };

  it('renders skip and submit buttons', () => {
    render(<QuestionActionButtons {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /skip question 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit answer for question 1/i })).toBeInTheDocument();
  });

  it('calls skipQuestion when skip button is clicked', () => {
    const mockSkipQuestion = jest.fn();
    jest.mocked(require('../stores/quizStore').useQuizStore).mockReturnValue({
      skipQuestion: mockSkipQuestion,
      submitQuestion: jest.fn(),
      isLoading: false
    });

    render(<QuestionActionButtons {...defaultProps} />);
    
    const skipButton = screen.getByRole('button', { name: /skip question 1/i });
    fireEvent.click(skipButton);
    
    expect(mockSkipQuestion).toHaveBeenCalledWith(1);
  });

  it('calls submitQuestion when submit button is clicked', () => {
    const mockSubmitQuestion = jest.fn();
    jest.mocked(require('../stores/quizStore').useQuizStore).mockReturnValue({
      skipQuestion: jest.fn(),
      submitQuestion: mockSubmitQuestion,
      isLoading: false
    });

    render(<QuestionActionButtons {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /submit answer for question 1/i });
    fireEvent.click(submitButton);
    
    expect(mockSubmitQuestion).toHaveBeenCalledWith(1);
  });

  it('supports keyboard navigation with Enter key', () => {
    const mockSkipQuestion = jest.fn();
    jest.mocked(require('../stores/quizStore').useQuizStore).mockReturnValue({
      skipQuestion: mockSkipQuestion,
      submitQuestion: jest.fn(),
      isLoading: false
    });

    render(<QuestionActionButtons {...defaultProps} />);
    
    const skipButton = screen.getByRole('button', { name: /skip question 1/i });
    fireEvent.keyDown(skipButton, { key: 'Enter' });
    
    expect(mockSkipQuestion).toHaveBeenCalledWith(1);
  });

  it('supports keyboard navigation with Space key', () => {
    const mockSubmitQuestion = jest.fn();
    jest.mocked(require('../stores/quizStore').useQuizStore).mockReturnValue({
      skipQuestion: jest.fn(),
      submitQuestion: mockSubmitQuestion,
      isLoading: false
    });

    render(<QuestionActionButtons {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /submit answer for question 1/i });
    fireEvent.keyDown(submitButton, { key: ' ' });
    
    expect(mockSubmitQuestion).toHaveBeenCalledWith(1);
  });

  it('shows loading state when isLoading is true', () => {
    jest.mocked(require('../stores/quizStore').useQuizStore).mockReturnValue({
      skipQuestion: jest.fn(),
      submitQuestion: jest.fn(),
      isLoading: true
    });

    render(<QuestionActionButtons {...defaultProps} />);
    
    expect(screen.getByText('Skipping...')).toBeInTheDocument();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<QuestionActionButtons {...defaultProps} disabled={true} />);
    
    const skipButton = screen.getByRole('button', { name: /skip question 1/i });
    const submitButton = screen.getByRole('button', { name: /submit answer for question 1/i });
    
    expect(skipButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('uses custom ARIA labels when provided', () => {
    render(
      <QuestionActionButtons 
        {...defaultProps} 
        skipAriaLabel="Custom skip label"
        submitAriaLabel="Custom submit label"
      />
    );
    
    expect(screen.getByRole('button', { name: /custom skip label/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom submit label/i })).toBeInTheDocument();
  });

  it('calls custom callbacks when provided', () => {
    const mockOnSkip = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <QuestionActionButtons 
        {...defaultProps} 
        onSkip={mockOnSkip}
        onSubmit={mockOnSubmit}
      />
    );
    
    const skipButton = screen.getByRole('button', { name: /skip question 1/i });
    const submitButton = screen.getByRole('button', { name: /submit answer for question 1/i });
    
    fireEvent.click(skipButton);
    fireEvent.click(submitButton);
    
    expect(mockOnSkip).toHaveBeenCalledWith(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(1);
  });
}); 