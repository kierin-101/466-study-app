import React, { useState } from 'react';

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [targetScore, setTargetScore] = useState(0);
  const [questionBank, setQuestionBank] = useState([
    {
      question: 'Untitled question', points: 10, multiselect: false, options: [
        { answer: 'Answer 1', isCorrect: false },
        { answer: 'Answer 2', isCorrect: true },
        { answer: 'Answer 3', isCorrect: false },
        { answer: 'Answer 4', isCorrect: false }]
    },
  ]);

  function addQuestion(e) {
    e.preventDefault();
    setQuestionBank([...questionBank, {
      question: 'New question', points: 10, multiselect: false, options: [
        { answer: 'Answer 1', isCorrect: false },
        { answer: 'Answer 2', isCorrect: true },
        { answer: 'Answer 3', isCorrect: false },
        { answer: 'Answer 4', isCorrect: false }]
    }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      releaseDate: releaseDate,
      dueDate: dueDate,
      questions: questionBank,
      assignedClass: assignedClass,
      createdBy: 'User ID',
      targetScore: targetScore
    };
    console.log('Quiz Data:', quizData);
    // We'd actually send this off to the database but whatever
  }

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
      `}
    </style>
    <h1>Create Quiz</h1>
    <div id="quizInfo">
      <h2>Quiz Information</h2>
      <div class="row">
        <label for="quizTitle">Quiz Title:</label>
        <input id="quizTitle" type="text" required onChange={
          (e) => setQuizTitle(e.target.value)
        } />
      </div>
      <div class="row">
        <label for="quizDescription">Quiz Description (optional):</label>
        <input id="quizDescription" type="text" onChange={
          (e) => setQuizDescription(e.target.value)
        } />
      </div>
      <div class="row">
        <label for="releaseDate">Release Date:</label>
        <input id="releaseDate" type="datetime-local" required onChange={
          (e) => setReleaseDate(e.target.value)
        } />
      </div>
      <div class="row">
        <label for="dueDate">Due Date:</label>
        <input id="dueDate" type="datetime-local" required onChange={
          (e) => setDueDate(e.target.value)
        } />
      </div>
      <div class="row">
        <label for="assignedClass">Assigned Class:</label>
        <select id="assignedClass" onChange={
          (e) => setAssignedClass(e.target.value)
        } required>
          <option value="">Select Class</option>
          <option value="class1">Class 1</option>
          <option value="class2">Class 2</option>
          <option value="class3">Class 3</option>
          <option value="class4">Class 4</option>
        </select>
      </div>
      <div class="row">
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
                <div class="row">
                  <label for={`question${index}`}>Question {index + 1}: </label>
                  <input id={`question${index}`} type="text" value={question.question} required onChange={
                    (e) => {
                      const updatedQuestions = [...questionBank];
                      updatedQuestions[index].question = e.target.value;
                      setQuestionBank(updatedQuestions);
                    }
                  } />
                </div>
                <div class="row">
                  <label for={`points${index}`}>Points:</label>
                  <input id={`points${index}`} type="number" min="0" value={question.points} required
                    onChange={
                      (e) => {
                        const updatedQuestions = [...questionBank];
                        updatedQuestions[index].points = e.target.value;
                        setQuestionBank(updatedQuestions);
                      }
                    }
                    onBlur={
                      (e) => {
                        if (e.target.value < 0) {
                          alert('Points cannot be negative. Setting to 0.');
                          e.target.value = 0;
                          const updatedQuestions = [...questionBank];
                          updatedQuestions[index].points = 0;
                          setQuestionBank(updatedQuestions);
                        }
                      }
                    } />
                </div>
                <div class="row">
                  <label for={`multiselect${index}`}>Multiple Select:</label>
                  <input id={`multiselect${index}`} type="checkbox" checked={question.multiselect} onChange={
                    (e) => {
                      const updatedQuestions = [...questionBank];
                      updatedQuestions[index].multiselect = e.target.checked;
                      setQuestionBank(updatedQuestions);
                    }
                  } />
                </div>
                <div>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex}>
                      <label for={`optionQ${index}A${optIndex}`}>Option {optIndex + 1}:</label>
                      <input id={`optionQ${index}A${optIndex}`} type="text" value={option.answer} required onChange={
                        (e) => {
                          const updatedQuestions = [...questionBank];
                          updatedQuestions[index].options[optIndex].answer = e.target.value;
                          setQuestionBank(updatedQuestions);
                        }
                      } />
                      <label for={`correctQ${index}A${optIndex}`}>Correct Answer</label>
                      <input type="checkbox" id={`correctQ${index}A${optIndex}`} onChange={
                        (e) => {
                          const updatedQuestions = [...questionBank];
                          updatedQuestions[index].options[optIndex].isCorrect = e.target.checked;
                          setQuestionBank(updatedQuestions);
                        }
                      } checked={
                        question.options[optIndex].isCorrect
                      } />
                      <button onClick={
                        (e) => {
                          e.preventDefault();
                          if (question.options.length > 1) {
                            const updatedQuestions = [...questionBank];
                            updatedQuestions[index].options.splice(optIndex, 1);
                            setQuestionBank(updatedQuestions);
                          } else {
                            alert('You must have at least one option for each question.');
                          }
                        }
                      }>Remove Option</button>
                    </div>
                  ))}
                  <button onClick={
                    (e) => {
                      e.preventDefault();
                      const updatedQuestions = [...questionBank];
                      updatedQuestions[index].options.push({ answer: 'New Option', isCorrect: false });
                      setQuestionBank(updatedQuestions);
                    }
                  }>Add Option</button>
                </div>
              </div>
              <button onClick={
                (e) => {
                  e.preventDefault();
                  if (questionBank.length > 1) {
                    const updatedQuestions = [...questionBank];
                    updatedQuestions.splice(index, 1);
                    setQuestionBank(updatedQuestions);
                  } else {
                    alert('You must have at least one question in the quiz.');
                  }
                }
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