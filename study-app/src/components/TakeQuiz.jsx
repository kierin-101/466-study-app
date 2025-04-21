import React, { useState, useEffect } from 'react';

export default function TakeQuiz() {
  // const [quizId, setQuizId] = useState('12345');
  const [quizTitle, setQuizTitle] = useState('Quiz loading...');
  const [quizDescription, setQuizDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [questionBank, setQuestionBank] = useState([]);

  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // fetch quiz questions from the server
    const fetchQuestions = async () => {
      const quizID = new URLSearchParams(window.location.search).get('quiz');
      // general quiz data
      fetch('http://localhost:5000/api/quiz/' + quizID)
        .then((response) => response.json())
        .then((data) => {
          setQuizTitle(data.title);
          setQuizDescription(data.description);
          setReleaseDate(new Date(data.release_timestamp).toString());
          setDueDate(new Date(data.due_timestamp).toString());
          const questions = data.questions.map((question) => {
            return {
              question: question.question_text,
              options: question.answers.map((option) => ({
                answer: option.answer_text,
                isCorrect: option.is_correct,
                points: option.points_rewarded,
              })),
              multiselect: question.multiple_select,
            };
          }
          );
          setQuestionBank(questions);
          setUserAnswers(Array(questions.length).fill([])); // Initialize user answers
        })
        .catch((error) => console.error('Error fetching quiz:', error));
    };
    fetchQuestions();
  }, []);

  function handleAnswerChange(questionIndex, answerIndex) {
    const question = questionBank[questionIndex];
    const selectedAnswer = question.options[answerIndex].answer;
    let updatedAnswers = [...userAnswers];

    if (question.multiselect) {
      // Toggle the answer for multiselect questions
      if (updatedAnswers[questionIndex].includes(selectedAnswer)) {
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (answer) => answer !== selectedAnswer
        );
      } else {
        updatedAnswers[questionIndex].push(selectedAnswer);
      }
    } else {
      // For single select questions, just set the answer
      updatedAnswers[questionIndex] = [selectedAnswer];
    }
    setUserAnswers(updatedAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Logic to submit the quiz
    const quizID = new URLSearchParams(window.location.search).get('quiz');
    const answers = userAnswers.map((userAnswer, index) => {
      return {
        question: questionBank[index].question,
        selectedAnswers: userAnswer,
      };
    });
    const data = {
      quizID: quizID,
      answers: answers,
      userAnswers: userAnswers
    };
    console.log('quiz data:', data);

    // highlight correct answers
    const correctAnswers = questionBank.map((question) => {
      return question.options.filter((option) => option.isCorrect).map((option) => option.answer);
    });

    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
      const questionIndex = parseInt(input.name.split('-')[1]);
      const answerIndex = questionBank[questionIndex].options.findIndex((option) => option.answer === input.value);
      if (questionBank[questionIndex].multiselect) {
        if (correctAnswers[questionIndex].includes(input.value)) {
          input.parentElement.style.color = 'green';
        } else {
          input.parentElement.style.color = 'red';
        }
      } else {
        if (correctAnswers[questionIndex][0] === input.value) {
          input.parentElement.style.color = 'green';
        } else {
          input.parentElement.style.color = 'red';
        }
      }
    });

    // highlight correct answers

  }

  return (
    <>
      <style>
        {`
        form {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        input[type="radio"],
        input[type="checkbox"] {
          margin-right: 10px;
        }
        #questionBank {
          margin-bottom: 20px;
        }
          `}
      </style>
      <form onSubmit={handleSubmit}>
        <h1>{quizTitle}</h1>
        <p>{quizDescription}</p>
        <p>Release Date: {releaseDate}</p>
        <p>Due Date: {dueDate}</p>
        <p>Current Time: {currentTime.toLocaleString()}</p>
        <div id="questionBank">
          {questionBank.map((question, index) => (
            <div key={index}>
              <h3>{question.question}</h3>
              {question.options.map((option, i) => (
                <div>
                  <input
                    type={question.multiselect ? 'checkbox' : 'radio'}
                    name={`question-${index}`}
                    value={option.answer}
                    onChange={() => handleAnswerChange(index, i)}
                  />
                  <label key={i}>
                    {option.answer}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">Submit Quiz</button>
      </form>
    </>
  );
}