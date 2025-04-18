import React, { useState, useEffect } from 'react';

export default function TakeQuiz() {
  // const [quizId, setQuizId] = useState('12345');
  const [quizTitle, setQuizTitle] = useState('Super Hard Quiz');
  const [quizDescription, setQuizDescription] = useState('This is the description.');
  const [releaseDate, setReleaseDate] = useState('2023-10-01 10:00 AM');
  const [dueDate, setDueDate] = useState('2023-10-15 10:00 PM');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [questionBank, setQuestionBank] = useState([
    {
      question: 'Who is the best group for 466?',
      multiselect: false,
      options: [
        { answer: 'Us', isCorrect: true },
        { answer: 'Them', isCorrect: false },
      ],
      points: 10
    },
    {
      question: 'What is the best programming language?',
      multiselect: false,
      options: [
        { answer: 'Brainf*ck', isCorrect: true },
        { answer: 'Java', isCorrect: false },
        { answer: 'C++', isCorrect: false },
        { answer: 'JavaScript', isCorrect: false }
      ],
      points: 10
    },
    {
      question: 'Select all prime numbers:',
      multiselect: true,
      options: [
        { answer: '2', isCorrect: true },
        { answer: '3', isCorrect: true },
        { answer: '4', isCorrect: false },
        { answer: '5', isCorrect: true }
      ],
      points: 30
    },
    {
      question: "Who \"teaches\" this course?",
      multiselect: false,
      options: [
        { answer: 'Bagheri', isCorrect: true },
        { answer: 'Yao', isCorrect: false },
        { answer: 'Bohn', isCorrect: false },
        { answer: 'Tran', isCorrect: false }
      ],
      points: 5
    }
  ]);

  const [userAnswers, setUserAnswers] = useState(
    Array(questionBank.length).fill([])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleAnswerChange(questionIndex, answerIndex) {
    const updatedAnswers = [...userAnswers];
    const question = questionBank[questionIndex];
    const answer = question.options[answerIndex].answer;
    const isSelected = updatedAnswers[questionIndex].includes(answer);

    // If the question is multiselect, toggle the answer
    if (question.multiselect) {
      if (isSelected) {
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (ans) => ans !== answer
        );
      } else {
        updatedAnswers[questionIndex].push(answer);
      }
    } else {
      updatedAnswers[questionIndex] = [answer];
    }
    setUserAnswers(updatedAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Logic to submit the quiz
    // check correctness of answers
    const totalPointsPossible = questionBank.reduce((acc, question) => acc + question.points, 0);
    let pointsEarned = 0;
    const results = questionBank.map((question, index) => {
      const correctAnswers = question.options
        .filter(option => option.isCorrect)
        .map(option => option.answer);

      const userAnswer = userAnswers[index];
      let userIsCorrect = false;
      let pointsEarnedThisQuestion = 0;

      if (question.multiselect) {
        const correctCount = correctAnswers.filter(answer => userAnswer.includes(answer)).length;
        const incorrectCount = userAnswer.filter(answer => !correctAnswers.includes(answer)).length;
        pointsEarnedThisQuestion = (correctCount - incorrectCount) * (question.points / correctAnswers.length);
        pointsEarned += pointsEarnedThisQuestion;
        userIsCorrect = correctCount === correctAnswers.length && incorrectCount === 0;
      } else {
        userIsCorrect = userAnswer[0] === correctAnswers[0];
        pointsEarnedThisQuestion = userIsCorrect ? question.points : 0
        pointsEarned += pointsEarnedThisQuestion;
      }

      document.querySelectorAll(`input[name="question-${index}"]`).forEach((input, i) => {
        if (question.options[i].isCorrect) {
          input.parentElement.style.color = 'green';
        } else {
          input.parentElement.style.color = 'red';
        }
      });

      return {
        question: question.question,
        userAnswer,
        correctAnswers,
        userIsCorrect,
        pointsPossible: question.points,
        pointsEarned: pointsEarnedThisQuestion
      };
    });
    // Display the results
    alert(`You earned ${pointsEarned} out of ${totalPointsPossible} points!`);
    console.log('Quiz submitted:', results);
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
          {questionBank.map((question, questionIndex) => (
            <div key={questionIndex}>
              <h3>{question.question}</h3>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type={question.multiselect ? "checkbox" : "radio"}
                    name={`question-${questionIndex}`}
                    value={option.answer}
                    checked={userAnswers[questionIndex].includes(option.answer)}
                    onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                  />
                  {option.answer}
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