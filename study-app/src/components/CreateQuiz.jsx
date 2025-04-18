import React, { useState } from 'react';

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [targetScore, setTargetScore] = useState(0);
  const [questionBank, setQuestionBank] = useState([
    {
      question: 'Untitled question', multiselect: false, options: [
        { answer: 'Answer 1', isCorrect: false, points: 0 },
        { answer: 'Answer 2', isCorrect: true, points: 10 },
        { answer: 'Answer 3', isCorrect: false, points: 0 },
        { answer: 'Answer 4', isCorrect: false, points: 0 }]
    },
  ]);

  function addQuestion(e) {
    e.preventDefault();
    setQuestionBank([...questionBank, {
      question: 'New question', multiselect: false, options: [
        { answer: 'Answer 1', isCorrect: false, points: 0 },
        { answer: 'Answer 2', isCorrect: true, points: 10 },
        { answer: 'Answer 3', isCorrect: false, points: 0 },
        { answer: 'Answer 4', isCorrect: false, points: 0 }]
    }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // check to make sure each question has at least one correct answer
    const questionsMissingCorrectAnswer = questionBank.filter(question => {
      return question.options.filter(option => option.isCorrect).length === 0;
    });
    if (questionsMissingCorrectAnswer.length > 0) {
      alert(`Question(s) ${questionsMissingCorrectAnswer.map((q, index) => index + 1).join(', ')} missing correct answers.`);
      return;
    }
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      releaseDate: releaseDate,
      dueDate: dueDate,
      questions: questionBank,
      assignedClass: new URLSearchParams(window.location.search).get('class'),
      targetScore: targetScore
    };
    console.log('Quiz Data:', quizData);

    fetch("http://localhost:5000/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    })
  }

  const removeQuestion = (e, index) => {
    e.preventDefault();
    if (questionBank.length > 1) {
      const updatedQuestions = [...questionBank];
      updatedQuestions.splice(index, 1);
      setQuestionBank(updatedQuestions);
    } else {
      alert('You must have at least one question in the quiz.');
    }
  };

  const addOption = (e, index) => {
    e.preventDefault();
    const updatedQuestions = [...questionBank];
    updatedQuestions[index].options.push({ answer: 'New Option', isCorrect: false, points: 0 });
    setQuestionBank(updatedQuestions);
  };

  const removeOption = (e, question, index, optIndex) => {
    e.preventDefault();
    if (question.options.length > 1) {
      const updatedQuestions = [...questionBank];
      updatedQuestions[index].options.splice(optIndex, 1);
      setQuestionBank(updatedQuestions);
    } else {
      alert('You must have at least one option for each question.');
    }
  };

  const toggleOptionCorrectness = (e, index, optIndex) => {
    const updatedQuestions = [...questionBank];
    updatedQuestions[index].options[optIndex].isCorrect = e.target.checked;
    setQuestionBank(updatedQuestions);
  };

  const updateOptionAnswer = (e, index, optIndex) => {
    const updatedQuestions = [...questionBank];
    updatedQuestions[index].options[optIndex].answer = e.target.value;
    setQuestionBank(updatedQuestions);
  };

  const handleMultiselectChange = (e, index) => {
    const updatedQuestions = [...questionBank];
    updatedQuestions[index].multiselect = e.target.checked;
    setQuestionBank(updatedQuestions);
  };

  const updateQuestionPoints = (e, question, index) => {
    if (e.target.value < 0) {
      alert('Points cannot be negative. Setting to 0.');
      e.target.value = 0;
      const updatedQuestions = [...questionBank];
      updatedQuestions[index].options.forEach(option => {
        option.points = 0;
      });
      setQuestionBank(updatedQuestions);
    }
    const updatedQuestions = [...questionBank];
    const numCorrectAnswers = updatedQuestions[index].options.filter(option => option.isCorrect).length;
    updatedQuestions[index].options.forEach(option => {
      if (option.isCorrect) {
        option.points = e.target.value;
        if (question.multiselect) {
          option.points = e.target.value / numCorrectAnswers;
        }
      } else {
        option.points = 0;
      }
    });
    setQuestionBank(updatedQuestions);
  };

  const updateQuestionText = (e, index) => {
    const updatedQuestions = [...questionBank];
    updatedQuestions[index].question = e.target.value;
    setQuestionBank(updatedQuestions);
  };

  return <form onSubmit={handleSubmit}>
    <style>
      {`
      h1 {
        text-align: center;
        margin: 20px 0;
      }
      form {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      button {
        margin: 5px;
      }
      #questionBank {
        margin: 20px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      #quizInfo {
        margin: 20px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      #quizInfo label, #questionBank label {
        padding: 0px 10px;
      }
      .row {
        margin: 10px 0;
      }
      .row label {
        width: 150px;
        display: inline-block;
      }
      .char-counter {
        margin-left: 10px;
        font-size: 0.8em;
        color: #666;
      }
      `}
    </style>
    <h1>Create Quiz</h1>
    <div id="quizInfo">
      <h2>Quiz Information</h2>
      <div className="row">
        <label for="quizTitle">Quiz Title:</label>
        <input id="quizTitle" type="text" required maxLength={100} value={quizTitle} onChange={
          (e) => setQuizTitle(e.target.value)
        } />
        <span className="char-counter">
          {100 - quizTitle.length} chars left
        </span>
      </div>
      <div className="row">
        <label for="quizDescription">Quiz Description (optional):</label>
        <input
          id="quizDescription"
          type="text"
          maxLength={1000}
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
        />
        <span className="char-counter">
          {1000 - quizDescription.length} chars left
        </span>
      </div>
      <div className="row">
        <label for="releaseDate">Release Date:</label>
        <input id="releaseDate" type="datetime-local" required onChange={
          (e) => setReleaseDate(e.target.value)
        } />
      </div>
      <div className="row">
        <label for="dueDate">Due Date:</label>
        <input id="dueDate" type="datetime-local" required onChange={
          (e) => setDueDate(e.target.value)
        } />
      </div>
      <div className="row">
        <label for="targetScore">Target Score (optional):</label>
        <input id="targetScore" type="number" min="0"
          onChange={
            (e) => {
              setTargetScore(e.target.value);
            }
          }
          onBlur={
            (e) => {
              if (e.target.value < 0) {
                alert('Target score cannot be negative. Setting to 0.');
                e.target.value = 0;
                setTargetScore(0);
              }
            }
          }
        />
      </div>
    </div>
    <div id="questionBank">
      <h2>Question Bank</h2>
      {
        questionBank.map(
          (question, index) => (
            <>
              <hr />
              <div key={index}>
                <div className="row">
                  <label for={`question${index}`}>
                    Question {index + 1}:
                  </label>
                  <input
                    id={`question${index}`}
                    type="text"
                    maxLength={1000}
                    placeholder={question.question}
                    required
                    onChange={e => updateQuestionText(e, index)}
                  />
                  <span className="char-counter">{1000 - question.question.length} chars left</span>
                </div>
                <div className="row">
                  <label for={`points${index}`}>
                    Points:
                  </label>
                  <input
                    id={`points${index}`}
                    type="number"
                    min="0"
                    value={question.points}
                    required
                    onChange={e => updateQuestionPoints(e, question, index)}
                    onBlur={e => updateQuestionPoints(e, question, index)}
                  />
                </div>
                <div className="row">
                  <label for={`multiselect${index}`}>
                    Multiple Select:
                  </label>
                  <input
                    id={`multiselect${index}`}
                    type="checkbox"
                    checked={question.multiselect}
                    onChange={e => handleMultiselectChange(e, index)}
                  />
                </div>
                <div>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex}>
                      <label for={`optionQ${index}A${optIndex}`}>
                        Option {optIndex + 1}:
                      </label>
                      <input
                        id={`optionQ${index}A${optIndex}`}
                        type="text" placeholder={option.answer}
                        maxLength={1000}
                        required
                        onChange={e => updateOptionAnswer(e, index, optIndex)}
                      />
                      <span className="char-counter">{1000 - option.answer.length} chars left</span>
                      <label for={`correctQ${index}A${optIndex}`}>
                        Correct Answer
                      </label>
                      <input type="checkbox"
                        id={`correctQ${index}A${optIndex}`}
                        onChange={e =>
                          toggleOptionCorrectness(e, index, optIndex)
                        }
                        checked={question.options[optIndex].isCorrect} />
                      <button onClick={
                        e => removeOption(e, question, index, optIndex)
                      }>
                        Remove Option
                      </button>
                    </div>
                  ))}
                  <button onClick={
                    e => addOption(e, index)
                  }>Add Option</button>
                </div>
              </div>
              <button onClick={
                e => removeQuestion(e, index)
              }>Remove Question</button>
            </>
          )
        )
      }
      <hr />
      <div>
        <button onClick={addQuestion}>Add Question</button>
      </div>
    </div>
    <button type="submit">Submit Quiz</button>
  </form>
}