import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateClass from '../src/components/CreateClass';
import { enableFetchMocks } from 'jest-fetch-mock';
import { jest, expect, describe, beforeEach, test } from '@jest/globals';

enableFetchMocks();

const dummyClassData = {
  message: "Class created successfully",
  class: {
    class_id: 1,
    class_name: "Test Class",
    subject: "English",
    daily_point_cap: 200
  }
}

const fillDummyClassFields = () => {
  const className = screen.getByLabelText(/Class Name:/i);
  fireEvent.change(className, { target: { value: 'Test Class' } });

  const subject = screen.getByLabelText(/Subject:/i);
  fireEvent.change(subject, { target: { value: 'English' } });

  const dailyPointsCap = screen.getByLabelText(/Daily Points Cap:/i);
  fireEvent.change(dailyPointsCap, { target: { value: '200' } });
};

// Mock alert
window.alert = jest.fn();
// Mock confirm
window.confirm = jest.fn();
// Mock global.location
delete window.location;
window.location = { href: '', search: '?class=123' };

describe('CreateClass Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    fetch.mockResponseOnce(
      JSON.stringify(dummyClassData),
      { status: 200 }
    );
  });

  test('does not submit class with no class name', async () => {
    render(<CreateClass teacherView={true}/>);
    fillDummyClassFields();
    // Setup failure response
    const submitButton = screen.getByText('Create Now');
    
    // Clear required fields
    const className = screen.getByLabelText(/Class Name:/i);
    fireEvent.change(className, { target: { value: '' } });
    
    fireEvent.click(submitButton);
    
    // Expect form validation to prevent submission
    expect(fetch).not.toHaveBeenCalled();
  });

  test('does not submit class with no subject', async () => {
    render(<CreateClass teacherView={true}/>);
    fillDummyClassFields();
    // Setup failure response
    const submitButton = screen.getByText('Create Now');
    
    // Clear required fields
    const className = screen.getByLabelText(/Subject:/i);
    fireEvent.change(className, { target: { value: '' } });
    
    fireEvent.click(submitButton);
    
    // Expect form validation to prevent submission
    expect(fetch).not.toHaveBeenCalled();
  });

  test('does not submit class with a daily points cap less than 100', async () => {
    render(<CreateClass teacherView={true}/>);
    fillDummyClassFields();
    // Setup failure response
    const submitButton = screen.getByText('Create Now');

    // Find the points input for the first question
    const pointsInput = screen.getByLabelText(/Daily Points Cap:/i);
    fireEvent.change(pointsInput, { target: { value: '99' } });
    
    fireEvent.click(submitButton);

    // Expect form validation to prevent submission
    expect(fetch).not.toHaveBeenCalled();
  });

  test('submits complete class to database', async () => {
    // Setup success response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '123' })
    });

    render(<CreateClass teacherView={true}/>);

    fillDummyClassFields();

    // Submit the form
    const submitButton = screen.getByText('Create Now');
    fireEvent.click(submitButton);

    // Verify API was called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/class/create'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        })
      })
    );
  });
});