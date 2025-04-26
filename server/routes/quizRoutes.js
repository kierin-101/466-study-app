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

// Route to store user answers to quiz

router.post('/user-answers', async(req, res) => {
  const { attempt, answers } = req.body;
  const config = req.config;
  const user_id = req.session?.userId
  console.log(user_id);

  if (!attempt || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getPool(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();


    for (const ans of answers) {
      const request = new sql.Request(transaction);
      await request
        .input('user_id', sql.Int, user_id)
        .input('attempt', sql.Int, attempt)
        .input('answer_id', sql.Int, ans.answer_id)
        .query(`
          INSERT INTO UserAnswers (user_id, attempt, answer_id)
          VALUES (@user_id, @attempt, @answer_id)
          `);
    }

    await transaction.commit();
    res.status(201).json({ message: 'User answers saved successfully' });
  } catch (err) {
    console.error('Error saving answers:', err);
    res.status(500).json({ error: 'Failed to save answers' });
    }
  });

// Route to award points
router.post('/award-points', async (req, res) => {
  const { points_delta, description, quiz_id } = req.body;
  const user_id = req.session?.userId;
  const config = req.config;

  if(!points_delta || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await sql.connect(config);

    const { recordset: userClasses } = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT c.daily_point_cap
      FROM UserClasses uc
      JOIN Classes c ON uc.class_id = c.class_id
      WHERE uc.user_id = @user_id
      `);

    if (userClasses.length === 0) {
      return res.status(400).json({ error: 'User is not enrolled in a class' });
    }

    const dailyCap = userClasses[0].daily_point_cap;

    const { recordset: pointsTodayResult } = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT ISNULL(SUM(points_delta), 0) AS points_today
      FROM PointsHistory
      WHERE user_id = @user_id
        AND CAST(transaction_timestamp AS DATE) = CAST(GETDATE() AS DATE)
        `);
    const pointsToday = pointsTodayResult[0].points_today;

    if (pointsToday + points_delta > dailyCap) {
      return res.status(400).json({ error: 'Daily point cap exceeded' });
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();


    await new sql.Request(transaction)
      .input('user_id', sql.Int, user_id)
      .input('points_delta', sql.Int, points_delta)
      .input('description', sql.NVarChar(1000), description)
      .input('quiz_id', sql.Int, quiz_id || null)
      .query(`
        INSERT INTO PointsHistory (points_delta, transaction_timestamp, description, user_id, quiz_id)
        VALUES (@points_delta, GETDATE(), @description, @user_id, @quiz_id)
      `);

    await new sql.Request(transaction)
      .input('user_id', sql.Int, user_id)
      .input('points_delta', sql.Int, points_delta)
      .query(`
        UPDATE Users
        SET points = points + @points_delta
        WHERE user_id = @user_id
      `);
    await transaction.commit();

    res.status(200).json({message: 'Points awarded successfully' });
  } catch (err) {
    console.error('Error awarding points: ', err);
    res.status(500).json({ error: 'Failed to award points' });
  }
});
  
// Route to retrieve high scores for a quiz
router.get('/retrieve-high-scores/:quiz_id', async (req, res) => {
  const config = req.config;
  const quizId = parseInt(req.params.quiz_id);

  if (isNaN(quizId)) {
    return res.status(400).json({ message: 'Invalid quiz ID' });
  }

  try {
    const pool = await getPool(config);

    const highScoresResult = await pool.request()
      .input('quiz_id', sql.Int, quizId)
      .query(`
        WITH AttemptScores AS (
        SELECT 
          ua.user_id,
          ua.attempt,
          SUM(a.points_rewarded) AS total_points
        FROM UserAnswers ua
        JOIN Answers a ON ua.answer_id = a.answer_id
        JOIN Questions q ON a.question_id = q.question_id
        WHERE q.quiz_id = @quiz_id
        GROUP BY ua.user_id, ua.attempt
        ),
        HighScores AS (
          SELECT 
            user_id,
            MAX(total_points) AS high_score
          FROM AttemptScores
          GROUP BY user_id
        )
        SELECT 
          u.user_id,
          u.username,
          hs.high_score
        FROM HighScores hs
        JOIN Users u ON u.user_id = hs.user_id
        ORDER BY hs.high_score DESC;
      `);
    res.json(highScoresResult.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching high scores' });
  }
});
module.exports = router;