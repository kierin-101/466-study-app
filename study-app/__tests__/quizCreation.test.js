import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateQuiz from '../src/components/CreateQuiz';
import { enableFetchMocks } from 'jest-fetch-mock';
import { jest, expect, describe, beforeEach, test } from '@jest/globals';

enableFetchMocks();

const fillDummyQuizFields = () => {
  const quizTitle = screen.getByLabelText(/Quiz Title:/i);
  fireEvent.change(quizTitle, { target: { value: 'Test Quiz' } });

  const releaseDate = screen.getByLabelText(/Release Date:/i);
  fireEvent.change(releaseDate, { target: { value: '2023-06-01T10:00' } });

  const dueDate = screen.getByLabelText(/Due Date:/i);
  fireEvent.change(dueDate, { target: { value: '2023-06-10T10:00' } });

  const targetScore = screen.getByLabelText(/Target Score/i);
  fireEvent.change(targetScore, { target: { value: '10' } });
  fireEvent.blur(targetScore);

  const pointsInput = screen.getByLabelText(/Points:/i);
  fireEvent.change(pointsInput, { target: { value: '5' } });
  fireEvent.blur(pointsInput);

  const question1 = screen.getByLabelText(/Question 1:/i);
  fireEvent.change(question1, { target: { value: 'What is the capital of France?' } });
  fireEvent.blur(question1);
  const answer1 = screen.getByLabelText(/Option 1:/i);
  fireEvent.change(answer1, { target: { value: 'Tokyo' } });
  fireEvent.blur(answer1);

  const answer2 = screen.getByLabelText(/Option 2:/i);
  fireEvent.change(answer2, { target: { value: 'Paris' } });
  fireEvent.blur(answer2);

  const answer3 = screen.getByLabelText(/Option 3:/i);
  fireEvent.change(answer3, { target: { value: 'Berlin' } });
  fireEvent.blur(answer3);

  const answer4 = screen.getByLabelText(/Option 4:/i);
  fireEvent.change(answer4, { target: { value: 'Madrid' } });
  fireEvent.blur(answer4);
};

// Mock fetch API
window.fetch = jest.fn();
// Mock alert
window.alert = jest.fn();
// Mock global.location
delete window.location;
window.location = { href: '', search: '?class=123' };

describe('CreateQuiz Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows alert when submitting incomplete quiz', async () => {
    render(<CreateQuiz />);
    fillDummyQuizFields();
    // Setup failure response
    const submitButton = screen.getByText('Submit Quiz');

    // Clear required fields
    const quizTitle = screen.getByLabelText(/Quiz Title:/i);
    fireEvent.change(quizTitle, { target: { value: '' } });

    fireEvent.click(submitButton);

    // Expect form validation to prevent submission
    expect(fetch).not.toHaveBeenCalled();
  });

  test('submits complete quiz to database', async () => {
    // Setup success response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '123' })
    });

    render(<CreateQuiz />);

    fillDummyQuizFields();

    // Submit the form
    const submitButton = screen.getByText('Submit Quiz');
    fireEvent.click(submitButton);

    // Verify API was called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/quiz/create'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        })
      })
    );
  });

  test('resets negative points to 0', async () => {
    render(<CreateQuiz />);

    // Find the points input for the first question
    const pointsInput = screen.getByLabelText(/Points:/i);
    fireEvent.change(pointsInput, { target: { value: '-5' } });
    fireEvent.blur(pointsInput);

    // Verify alert was shown
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('Points cannot be negative'));
    expect(pointsInput.value).toBe('0');
  });

  test('resets negative target score to 0', async () => {
    render(<CreateQuiz />);

    const targetScore = screen.getByLabelText(/Target Score/i);
    fireEvent.change(targetScore, { target: { value: '-10' } });
    fireEvent.blur(targetScore);

    expect(alert).toHaveBeenCalledWith(expect.stringContaining('Target score cannot be negative'));
    expect(targetScore.value).toBe('0');
  });

  test('shows alert when questions have no correct answers', async () => {
    render(<CreateQuiz />);

    fillDummyQuizFields();

    // Unselect all correct answers
    const correctAnswerCheckbox = screen.getAllByLabelText(/Correct Answer/i)[1];
    fireEvent.click(correctAnswerCheckbox);

    // Submit the form
    const submitButton = screen.getByText('Submit Quiz');
    fireEvent.click(submitButton);

    // Verify alert was shown
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('missing correct answers'));
  });

  test('validates that release date is before due date', async () => {
    render(<CreateQuiz />);

    // fill out required fields
    fillDummyQuizFields();

    // Set release date after due date
    const releaseDate = screen.getByLabelText(/Release Date:/i);
    fireEvent.change(releaseDate, { target: { value: '2023-06-20T10:00' } });

    const dueDate = screen.getByLabelText(/Due Date:/i);
    fireEvent.change(dueDate, { target: { value: '2023-05-09T10:00' } });
    fireEvent.blur(dueDate);
    fireEvent.blur(releaseDate);

    // verify date variables were set correctly
    expect(releaseDate.value).toBe('2023-06-20T10:00');
    expect(dueDate.value).toBe('2023-05-09T10:00');


    // Submit the form
    const submitButton = screen.getByText('Submit Quiz');
    fireEvent.click(submitButton);

    // Verify alert was shown
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('Release date must be before due date.'));
  });
});