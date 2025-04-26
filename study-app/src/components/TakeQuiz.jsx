import React, { useState, useEffect } from 'react';

export default function TakeQuiz() {
  // const [quizId, setQuizId] = useState('12345');
  const [quizTitle, setQuizTitle] = useState('Quiz loading...');
  const [quizDescription, setQuizDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [questionBank, setQuestionBank] = useState([]);
  const [message, setMessage] = useState('');

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
          if (new Date(data.due_timestamp) < new Date()) {
            setMessage('This quiz is no longer available.');
            return
          }
          if (new Date(data.release_timestamp) > new Date()) {
            setMessage('This quiz is not yet available');
            return
          }
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
      userAnswers: userAnswers,
      correctAnswers: questionBank.map((question) => {
        return question.options.filter((option) => option.isCorrect).map((option) => option.answer);
      }),
    };
    console.log('quiz data:', data);
    // calculate points
    let totalPoints = questionBank.reduce((acc, question, index) => {
      const correctAnswers = question.options.filter((option) => option.isCorrect).map((option) => option.answer);
      const userAnswer = userAnswers[index];
      if (question.multiselect) {
        // For multiselect questions, add for correct, subtract for incorrect
        const correctPoints = question.options.reduce((acc, option) => {
          if (option.isCorrect && userAnswer.includes(option.answer)) {
            return acc + option.points;
          }
          return acc;
        }, 0);
        const incorrectPoints = question.options.reduce((acc, option) => {
          if (!option.isCorrect && userAnswer.includes(option.answer)) {
            // find a correct answer and subtract its points
            const correctOption = question.options.find((opt) => opt.isCorrect);
            return acc + correctOption.points;
          }
          return acc;
        }, 0);
        // don't allow negative points
        const adjustedPoints = Math.max(0, correctPoints - incorrectPoints);
        return acc + adjustedPoints;
      } else {
        // For single select questions, check if the selected answer is correct
        const isCorrect = correctAnswers[0] === userAnswer[0];
        return acc + (isCorrect ? question.options.find((option) => option.answer === userAnswer[0]).points : 0);
      }
    }, 0);
    console.log('Total points:', totalPoints);
    console.log('Possible points:', questionBank.reduce((acc, question) => {
      return acc + question.options.reduce((acc, option) => {
        return acc + option.points;
      }, 0);
    }, 0));
    // highlight correct answers
    const correctAnswers = questionBank.map((question) => {
      return question.options.filter((option) => option.isCorrect).map((option) => option.answer);
    });

    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
      const questionIndex = parseInt(input.name.split('-')[1]);
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
          {message ||
            questionBank.map((question, index) => (
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
        {(questionBank.length >= 1) && <button type="submit">Submit Quiz</button>}

      </form>
    </>
  );
}