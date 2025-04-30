import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassOverview from '../src/components/ClassOverview';
import { enableFetchMocks } from 'jest-fetch-mock';
import { jest, expect, describe, beforeEach, test } from '@jest/globals';

enableFetchMocks();

const dummyClassData = {
  classes: [
    {
      class_id: 1,
      class_name: "Test Class",
      subject: "English"
    },
    {
      class_id: 2,
      class_name: "Test Class 2",
      subject: "Math"
    }
  ]
}

// Mock alert
window.alert = jest.fn();
// Mock global.location
delete window.location;
window.location = { href: '', search: '?class=123' };

describe('ClassOverview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    fetch.mockResponseOnce(
      JSON.stringify(dummyClassData),
      { status: 200 }
    );
  });

  test('shows CreateClass button on teacher view', async () => {
    await act(async () => {
      render(<ClassOverview teacherView={true}/>);
    });
    
    // Get the create class button element and make sure it points to the right place
    const createClassButton = screen.getByText('+').closest('a');
    expect(createClassButton).toHaveAttribute('href', '/createClass');
  });

  test('shows JoinClass button on student view', async () => {
    await act(async () => {
      render(<ClassOverview teacherView={false}/>);
    });
    
    // Get the create class button element and make sure it points to the right place
    const joinClassButton = screen.getByText('+').closest('a');
    expect(joinClassButton).toHaveAttribute('href', '/joinClass');
  });

  test('shows a button for each class the user is in', async () => {
    await act(async () => {
      render(<ClassOverview teacherView={false}/>);
    });

    // Make sure we see a button for each class
    const class1 = screen.getByText(dummyClassData.classes[0].class_name).closest('a');
    expect(class1).toBeInTheDocument();
    const class2 = screen.getByText(dummyClassData.classes[1].class_name).closest('a');
    expect(class2).toBeInTheDocument();
  })
});