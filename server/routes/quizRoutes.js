const express = require('express');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const router = express.Router();

const getPool = async (config) => {
  if (!global.pool) {
    global.pool = await sql.connect(config);
  }
  return global.pool;
};

// Route to create a new quiz
router.post('/create', async (req, res) => {
  const { title, description, releaseDate, dueDate, questions, assignedClass, targetScore } = req.body;
  const config = req.config;

  if (!title || !releaseDate || !dueDate || !assignedClass) {
    return res.status(400).json({message: 'Missing quiz information' });
  }

  try {
    const pool = await getPool(config);

    const quizResult = await pool.request()
    .input('title', sql.NVarChar, title)
    .input('description', sql.NVarChar, description)
    .input('release_timestamp', sql.DateTime, releaseDate)
    .input('due_timestamp', sql.DateTime, dueDate)
    .input('target_score', sql.Decimal, targetScore)
    .input('class_id', sql.Int, assignedClass)
    .query(`INSERT INTO Quizzes (title, description, release_timestamp, due_timestamp, target_score, class_id)
      OUTPUT INSERTED.*
      VALUES (@title, @description, @release_timestamp, @due_timestamp, @target_score, @class_id)
    `);
    const createdQuiz = quizResult.recordset[0];

    const createdQuestions = [];
    const createdAnswers = [];
    for (const question of questions) {
      const questionResult = await pool.request()
      .input('question_text', sql.NVarChar, question.question)
      .input('multiple_select', sql.Bit, question.multiselect)
      .input('quiz_id', sql.Int, createdQuiz.quiz_id)
      .query(`INSERT INTO Questions (question_text, multiple_select, quiz_id)
        OUTPUT INSERTED.*
        VALUES (@question_text, @multiple_select, @quiz_id)
      `);
      createdQuestions.push(questionResult.recordset[0]);

      createdAnswers.push([]);
      for (const answer of question.options) {
        const answerResult = await pool.request()
        .input('answer_text', sql.NVarChar, answer.answer)
        .input('is_correct', sql.Bit, answer.isCorrect)
        .input('points_rewarded', sql.Int, answer.points)
        .input('question_id', sql.Int, createdQuestions[createdQuestions.length - 1].question_id)
        .query(`INSERT INTO Answers (answer_text, is_correct, points_rewarded, question_id)
          OUTPUT INSERTED.*
          VALUES (@answer_text, @is_correct, @points_rewarded, @question_id)
        `);
        createdAnswers[createdAnswers.length - 1].push(answerResult.recordset[0]);
      }
    }

    res.status(201).json({message: 'Quiz created successfully', quiz: createdQuiz, questions: createdQuestions, answers: createdAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating quiz' });
  }
});

// Route to get quiz information from id
router.get('/:quiz_id', async (req, res) => {
  const config = req.config;
  const quizId = parseInt(req.params.quiz_id);

  if (isNaN(quizId)) {
    return res.status(400).json({ message: 'Invalid quiz ID' });
  }
  
  try {
    const pool = await getPool(config);

    const quizResult = await pool.request()
    .input('quiz_id', sql.Int, quizId)
    .query('SELECT quiz_id, title, description, release_timestamp, due_timestamp, target_score, class_id FROM Quizzes WHERE quiz_id = @quiz_id');

    if (quizResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const quiz = quizResult.recordset[0];

    const questionsResult = await pool.request()
    .input('quiz_id', sql.Int, quizId)
    .query(`SELECT * FROM Questions WHERE quiz_id = @quiz_id`);

    if (questionsResult.recordset.length === 0) {
      return res.status(404).json({ message: `Quiz with ID ${quizId} has no questions` });
    }
    quiz.questions = questionsResult.recordset;

    for (const question of quiz.questions) {
      const answersResult = await pool.request()
      .input('question_id', sql.Int, question.question_id)
      .query(`SELECT * FROM Answers WHERE question_id = @question_id`);

      if (answersResult.recordset.length === 0) {
        return res.status(404).json({ message: `Question with ID ${question.question_id} has no answers` });
      }
      question.answers = answersResult.recordset;
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching quiz info' });
  }
});

module.exports = router;

