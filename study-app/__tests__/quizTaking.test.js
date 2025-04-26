import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TakeQuiz from "../src/components/TakeQuiz";
import { enableFetchMocks } from "jest-fetch-mock";
import { jest, expect, describe, beforeEach, test } from "@jest/globals";

enableFetchMocks();

const dummyQuizData = {
  title: "Test Quiz",
  description: "This is the description.",
  release_timestamp: "2023-01-01T15:00:00.000Z",
  due_timestamp: "2099-04-07T17:00:00.000Z",
  targetScore: 100,
  class_id: 123,
  questions: [
    {
      question_text: "What is the capital of France?",
      multiple_select: false,
      quiz_id: 123,
      answers: [
        {
          answer_id: 1,
          answer_text: "Tokyo",
          is_correct: false,
          points_rewarded: 0,
          question_id: 1,
        },
        {
          answer_id: 2,
          answer_text: "Paris",
          is_correct: true,
          points_rewarded: 5,
          question_id: 1,
        },
        {
          answer_id: 3,
          answer_text: "Berlin",
          is_correct: false,
          points_rewarded: 0,
          question_id: 1,
        },
        {
          answer_id: 4,
          answer_text: "Madrid",
          is_correct: false,
          points_rewarded: 0,
          question_id: 1,
        }
      ]
    },
  ],
}

window.alert = jest.fn();
delete window.location;
window.location = { href: "", search: "?quiz=123" };


describe("TakeQuiz Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // mock fetch api to get quiz data
  beforeEach(() => {
    fetch.mockResponseOnce(
      JSON.stringify(dummyQuizData),
      { status: 200 }
    );
  });
  test("renders quiz title and description", async () => {
    render(<TakeQuiz />);
    // wait for mock fetch to resolve
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    // wait for quiz title and description to be rendered
    const title = await screen.findByText(/Test Quiz/i);
    const description = await screen.findByText(/This is the description./i);
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders quiz questions and answers", async () => {
    render(<TakeQuiz />);
    const question = await screen.findByText(/What is the capital of France?/i);
    const answer1 = await screen.findByText(/Tokyo/i);
    const answer2 = await screen.findByText(/Paris/i);
    const answer3 = await screen.findByText(/Berlin/i);
    const answer4 = await screen.findByText(/Madrid/i);
    expect(question).toBeInTheDocument();
    expect(answer1).toBeInTheDocument();
    expect(answer2).toBeInTheDocument();
    expect(answer3).toBeInTheDocument();
    expect(answer4).toBeInTheDocument();
  });

  test("submits quiz answers", async () => {
    render(<TakeQuiz />);
    const answer2 = await screen.findByLabelText(/Paris/i);
    fireEvent.click(answer2);
    const submitButton = await screen.findByText(/Submit/i);
    fireEvent.click(submitButton);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(
      "Quiz submitted! You scored 5 points."
    ));
  });

});

describe('Attempting to take quiz before release date', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    const futureQuiz = {
      ...dummyQuizData,
      release_timestamp: "2026-01-01T15:00:00.000Z",
      due_timestamp: "2026-04-07T17:00:00.000Z",
    };
    console.log("Future:", futureQuiz);
    fetch.mockResponseOnce(
      JSON.stringify(futureQuiz),
      { status: 200 }
    );
  });

  test('shows alert when attempting to take quiz before release date', async () => {
    render(<TakeQuiz />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const alert = await screen.findByText(/This quiz is not yet available/i);
    expect(alert).toBeInTheDocument();
  });
});


describe('Attempting to take quiz after due date', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    const earlyQuiz = {
      ...dummyQuizData,
      release_timestamp: "2019-01-01T15:00:00.000Z",
      due_timestamp: "2019-01-12T17:00:00.000Z",
    };
    fetch.mockResponseOnce(
      JSON.stringify(earlyQuiz),
      { status: 200 }
    );
  });

  test('shows alert when attempting to take quiz after due date', async () => {
    render(<TakeQuiz />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const alert = await screen.findByText(/This quiz is no longer available/i);
    expect(alert).toBeInTheDocument();
  });
});