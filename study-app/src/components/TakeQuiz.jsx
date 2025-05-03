import React, { useState, useEffect } from "react";

export default function TakeQuiz() {
  // const [quizId, setQuizId] = useState('12345');
  const [quizTitle, setQuizTitle] = useState("Quiz loading...");
  const [quizDescription, setQuizDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [questionBank, setQuestionBank] = useState([]);
  const [message, setMessage] = useState("");

  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswerIDs, setUserAnswerIDs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quizID = new URLSearchParams(window.location.search).get("quiz");
    // fetch quiz questions from the server
    const fetchQuestions = async () => {
      // general quiz data
      fetch("http://localhost:5000/api/quiz/" + quizID)
        .then((response) => response.json())
        .then((data) => {
          setQuizTitle(data.title);
          setQuizDescription(data.description);
          setReleaseDate(new Date(data.release_timestamp).toString());
          setDueDate(new Date(data.due_timestamp).toString());
          if (new Date(data.due_timestamp) < new Date()) {
            setMessage("This quiz is no longer available.");
            return;
          }
          if (new Date(data.release_timestamp) > new Date()) {
            setMessage("This quiz is not yet available");
            return;
          }
          const questions = data.questions.map((question) => {
            return {
              questionID: question.question_id,
              question: question.question_text,
              options: question.answers.map((option) => ({
                answerID: option.answer_id,
                answer: option.answer_text,
                isCorrect: option.is_correct,
                points: option.points_rewarded,
              })),
              multiselect: question.multiple_select,
            };
          });
          setQuestionBank(questions);
          setUserAnswers(Array(questions.length).fill([])); // Initialize user answers
          setUserAnswerIDs(Array(questions.length).fill([])); // Initialize user answer IDs
        })
        .catch((error) => console.error("Error fetching quiz:", error));
    };
    fetchQuestions();
  }, []);

  function handleAnswerChange(questionIndex, answerIndex) {
    const question = questionBank[questionIndex];
    const selectedAnswer = question.options[answerIndex].answer;
    const selectedAnswerID = question.options[answerIndex].answerID;
    let updatedAnswers = [...userAnswers];
    let updatedAnswerIDs = [...userAnswerIDs];

    if (question.multiselect) {
      // Toggle the answer for multiselect questions
      if (updatedAnswers[questionIndex].includes(selectedAnswer)) {
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (answer) => answer !== selectedAnswer
        );
      } else {
        updatedAnswers[questionIndex].push(selectedAnswer);
        updatedAnswerIDs[questionIndex].push(selectedAnswerID);
      }
    } else {
      // For single select questions, just set the answer
      updatedAnswers[questionIndex] = [selectedAnswer];
      updatedAnswerIDs[questionIndex] = [selectedAnswerID];
    }
    setUserAnswers(updatedAnswers);
    setUserAnswerIDs(updatedAnswerIDs);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Logic to submit the quiz
    const quizID = new URLSearchParams(window.location.search).get("quiz");
    //submits this set of user answers to the database
    fetch(`http://localhost:5000/api/quiz/user-answers`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz_id: quizID,
        answers: userAnswerIDs.flat().map((ans) => {
          return { answer_id: ans };
        }),
      }),
    })
      .catch((error) => {
        console.error("Error:", error);
      });
    // calculate points
    let totalPoints = questionBank.reduce((acc, question, index) => {
      const correctAnswers = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.answer);
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
        return (
          acc +
          (isCorrect
            ? question.options.find((option) => option.answer === userAnswer[0])
              .points
            : 0)
        );
      }
    }, 0);

    fetch(`http://localhost:5000/api/quiz/award-points`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points_delta: totalPoints,
        description: `Earned taking quiz ${quizID}, ${quizTitle}`,
        quiz_id: quizID,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Points awarded successfully.");
          console.log(response);
          for (const [key, value] of Object.entries(response.body.values())) {
            console.log(key, value);
          }
          return response.json();
        } else {
          console.log("Points not awarded successfully.");
          throw new Error("Failed to grade this quiz.");
        }
      })
      .then((data) => {
        console.log("AAAAAAAAAAHHHHHHHHHHHHHHH");
        console.log(data);
        // highlight correct answers
        const correctAnswers = questionBank.map((question) => {
          return question.options
            .filter((option) => option.isCorrect)
            .map((option) => option.answer);
        });

        document
          .querySelectorAll('input[type="radio"], input[type="checkbox"]')
          .forEach((input) => {
            const questionIndex = parseInt(input.name.split("-")[1]);
            if (questionBank[questionIndex].multiselect) {
              if (correctAnswers[questionIndex].includes(input.value)) {
                input.parentElement.style.color = "green";
              } else {
                input.parentElement.style.color = "red";
              }
            } else {
              if (correctAnswers[questionIndex][0] === input.value) {
                input.parentElement.style.color = "green";
              } else {
                input.parentElement.style.color = "red";
              }
            }
          });
        alert(data.message);
      })
      .catch((error) => {
        alert("There was an error grading the quiz. Please try again.\n" + error);
      });
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
                  <div key={i}>
                    <input
                      type={question.multiselect ? "checkbox" : "radio"}
                      id={`question-${index}-option-${i}`}
                      name={`question-${index}`}
                      value={option.answer}
                      onChange={() => handleAnswerChange(index, i)}
                    />
                    <label htmlFor={`question-${index}-option-${i}`}>
                      {option.answer}
                    </label>
                  </div>
                ))}
              </div>
            ))}
        </div>
        {questionBank.length >= 1 && <button type="submit">Submit Quiz</button>}
      </form>
    </>
  );
}
