import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Class from '../src/components/Class';
import { enableFetchMocks } from 'jest-fetch-mock';
import { jest, expect, describe, beforeEach, test } from '@jest/globals';

enableFetchMocks();

const dummyClassData = {
  class_id: 2,
  class_name: "Test Class",
  subject: "English",
  daily_point_cap: 100
}

const dummyMembersData = [
  {
    user_id: 2,
    username: "teacher",
    is_teacher: true,
    points: 0,
    active_rewards: []
  },
  {
    user_id: 1,
    username: "student",
    is_teacher: false,
    points: 0,
    active_rewards: []
  }
]

const dummyQuizzesData = {
  quizzes: [
    {
      quiz_id: 1,
      title: "Test Quiz 1",
      description: "",
      release_timestamp: "2025-04-27T00:00:00.000Z",
      due_timestamp: "2025-05-03T23:59:00.000Z",
      target_score: 0
    },
    {
      quiz_id: 2,
      title: "Test Quiz 2",
      description: "",
      release_timestamp: "2025-04-27T00:00:00.000Z",
      due_timestamp: "2025-04-29T23:59:00.000Z",
      target_score: 0
    },
    {
      quiz_id: 3,
      title: "Test Quiz 3",
      description: "",
      release_timestamp: "2025-05-01T00:00:00.000Z",
      due_timestamp: "2025-05-03T23:59:00.000Z",
      target_score: 0
    }
  ]
}

const dummyHighScoreData1 = [
  30
]
const dummyHighScoreData2 = [
  30,
  50
]
const dummyHighScoreData3 = []

// Mock date
jest.useFakeTimers().setSystemTime(new Date('2025-04-30T00:00:00.000Z'));
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
    fetch.mockResponseOnce(
      JSON.stringify(dummyMembersData),
      { status: 200 }
    );
    fetch.mockResponseOnce(
      JSON.stringify(dummyQuizzesData),
      { status: 200 }
    );
    fetch.mockResponseOnce(
      JSON.stringify(dummyHighScoreData1),
      { status: 200 }
    );
    fetch.mockResponseOnce(
      JSON.stringify(dummyHighScoreData2),
      { status: 200 }
    );
    fetch.mockResponseOnce(
      JSON.stringify(dummyHighScoreData3),
      { status: 200 }
    );
  });

  test('shows sidebar with attributes', async () => {
    await act(async () => {
      render(<Class userId={2} teacherView={true} />);
    });

    // Get the side bar element and make sure all the contents have the correct values
    const joinCode = screen.getByText(/Join Code:/i).closest('p');
    expect(joinCode).toHaveTextContent(dummyClassData.class_id);
    const subject = screen.getByText(/Subject:/i).closest('p');
    expect(subject).toHaveTextContent(dummyClassData.subject);
    const pointsDaily = screen.getByText(/Points Daily:/i).closest('p');
    expect(pointsDaily).toHaveTextContent(dummyClassData.daily_point_cap);
  });

  test('sidebar does not show join code attribute for students', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    // Get the side bar element and make sure all the contents have the correct values
    const joinCode = screen.queryByText(/Join Code:/i);
    expect(joinCode).not.toBeInTheDocument();
    const subject = screen.getByText(/Subject:/i).closest('p');
    expect(subject).toHaveTextContent(dummyClassData.subject);
    const pointsDaily = screen.getByText(/Points Daily:/i).closest('p');
    expect(pointsDaily).toHaveTextContent(dummyClassData.daily_point_cap);
  });

  test('shows all quizzes on default All Quizzes tab', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    // Make sure all three quizzes are rendered
    const quiz1 = screen.getByText(dummyQuizzesData.quizzes[0].title).closest('a');
    expect(quiz1).toBeInTheDocument();
    const quiz2 = screen.getByText(dummyQuizzesData.quizzes[1].title).closest('a');
    expect(quiz2).toBeInTheDocument();
    const quiz3 = screen.getByText(dummyQuizzesData.quizzes[2].title).closest('a');
    expect(quiz3).toBeInTheDocument();
  });

  test('shows only open quizzes on Open Quizzes tab', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    const openQuizzesButton = screen.getByText('Open Quizzes');
    fireEvent.click(openQuizzesButton);

    // Make sure only the open quiz is rendered
    const quiz1 = screen.getByText(dummyQuizzesData.quizzes[0].title).closest('a');
    expect(quiz1).toBeInTheDocument();
    const quiz2 = screen.queryByText(dummyQuizzesData.quizzes[1].title);
    expect(quiz2).not.toBeInTheDocument();
    const quiz3 = screen.queryByText(dummyQuizzesData.quizzes[2].title);
    expect(quiz3).not.toBeInTheDocument();
  });

  test('shows only upcoming quizzes on Upcoming Quizzes tab', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    const upcomingQuizzesButton = screen.getByText('Upcoming Quizzes');
    fireEvent.click(upcomingQuizzesButton);

    // Make sure only the upcoming quiz is rendered
    const quiz1 = screen.queryByText(dummyQuizzesData.quizzes[0].title);
    expect(quiz1).not.toBeInTheDocument();
    const quiz2 = screen.queryByText(dummyQuizzesData.quizzes[1].title);
    expect(quiz2).not.toBeInTheDocument();
    const quiz3 = screen.getByText(dummyQuizzesData.quizzes[2].title).closest('a');
    expect(quiz3).toBeInTheDocument();
  });

  test('shows only closed quizzes on Past Quizzes tab', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    const pastQuizzesButton = screen.getByText('Past Quizzes');
    fireEvent.click(pastQuizzesButton);

    // Make sure only the closed quiz is rendered
    const quiz1 = screen.queryByText(dummyQuizzesData.quizzes[0].title);
    expect(quiz1).not.toBeInTheDocument();
    const quiz2 = screen.getByText(dummyQuizzesData.quizzes[1].title).closest('a');
    expect(quiz2).toBeInTheDocument();
    const quiz3 = screen.queryByText(dummyQuizzesData.quizzes[2].title);
    expect(quiz3).not.toBeInTheDocument();
  });

  test('shows members on People tab', async () => {
    await act(async () => {
      render(<Class userId={1} teacherView={false} />);
    });

    const peopleButton = screen.getByText('People');
    fireEvent.click(peopleButton);

    // Make sure both the teacher and student are rendered
    const student = screen.getByText(dummyMembersData[0].username);
    expect(student).toBeInTheDocument();
    const teacher = screen.getByText(dummyMembersData[1].username);
    expect(teacher).toBeInTheDocument();
  });
});