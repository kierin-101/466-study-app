import React, { useState } from 'react';

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questionBank, setQuestionBank] = useState([
    { question: 'Untitled question', multiselect: false, options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], correctOptions: [2] },
  ]);

  function addQuestion(e) {
    e.preventDefault();
    setQuestionBank([...questionBank, { question: 'Untitled question', multiselect: false, options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], correctOptions: [2] }]);
  }

  return <form>
    <h1>Create Quiz</h1>
    <div>
      <label for="quizTitle">Quiz Title:</label>
      <input id="quizTitle" type="text" required onChange={
        (e) => setQuizTitle(e.target.value)
      } />
    </div>
    <div>
      <label for="quizDescription">Quiz Description:</label>
      <input id="quizDescription" type="text" onChange={
        (e) => setQuizDescription(e.target.value)
      } />
    </div>
    <div>
      <label for="releaseDate">Release Date:</label>
      <input id="releaseDate" type="date" onChange={
        (e) => setReleaseDate(e.target.value)
      } />
    </div>
    <div>
      <label for="dueDate">Due Date:</label>
      <input id="dueDate" type="date" onChange={
        (e) => setDueDate(e.target.value)
      } />
    </div>
    <div>
      <button onClick={addQuestion}>Add Question</button>
    </div>
    <div id="questionBank">
      <h2>Question Bank</h2>
      {
        questionBank.map(
          (question, index) => (
            <>
              <hr />
              <div key={index}>
                <div>
                  <label for={`question${index}`}>Question {index + 1}: </label>
                  <input id={`question${index}`} type="text" value={question.question} required onChange={
                    (e) => {
                      const updatedQuestions = [...questionBank];
                      updatedQuestions[index].question = e.target.value;
                      setQuestionBank(updatedQuestions);
                    }
                  } />
                </div>
                <div>
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
                      <label for={`optionQ${index}A${optIndex}`}>Option:</label>
                      <input id={`optionQ${index}A${optIndex}`} type="text" value={option} required onChange={
                        (e) => {
                          const updatedQuestions = [...questionBank];
                          updatedQuestions[index].options[optIndex] = e.target.value;
                          setQuestionBank(updatedQuestions);
                        }
                      } />
                      <label for={`correctQ${index}A${optIndex}`}>Correct Answer</label>
                      <input type="checkbox" id={`correctQ${index}A${optIndex}`} onChange={
                        (e) => {
                          const updatedQuestions = [...questionBank];
                          if (e.target.checked) {
                            updatedQuestions[index].correctOptions.push(optIndex);
                          } else {
                            updatedQuestions[index].correctOptions = updatedQuestions[index].correctOptions.filter((opt) => opt !== optIndex);
                          }
                        }
                      } checked={
                        question.correctOptions.includes(optIndex)
                      } />
                    </div>
                  ))}
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
    </div>
    <button type="submit">Submit Quiz</button>
    <button type="reset">Reset</button>
  </form>
}