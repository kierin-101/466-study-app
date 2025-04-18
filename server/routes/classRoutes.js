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

// Route to join a class
router.post('/join', async (req, res) => {
  const {class_id} = req.body;
  const config = req.config;
  const userId = req.session?.userId

  if (!userId) {
    return res.status(401).json({message: 'Not authenticated'});
  }

  if (!class_id) {
    return res.status(400).json({message: 'Missing class_id'});
  }

  try {
    const pool = await getPool(config);
    const result = await pool.request()
    .input('class_id', sql.Int, class_id)
    .query('SELECT * FROM Classes WHERE class_id = @class_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({message: 'Class not found'});
    }

    const existing = await pool.request()
    .input('user_id', sql.Int, userId)
    .input('class_id', sql.Int, class_id)
    .query('SELECT * FROM UserClasses WHERE user_id = @user_id AND class_id = @class_id');

    if (existing.recordset.length > 0) {
      return res.status(400).json({message: 'User already joined this class' });
    }


    await pool.request()
    .input('user_id', sql.Int, userId)
    .input('class_id', sql.Int, class_id)
    .query('INSERT INTO UserClasses (user_id, class_id) VALUES (@user_id, @class_id)');

    res.status(201).json({message: 'Successfully joined class'});

  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error joining class'});
  }
});

// Rotue to create a new class
router.post('/create', async (req, res) => {
  const { class_name, subject, daily_point_cap } = req.body;
  const config = req.config;

  if (!class_name || !subject || daily_point_cap == null) {
    return res.status(400).json({message: 'Missing class information' });
  }

  try {
    const pool = await getPool(config);

    const result = await pool.request()
    .input('class_name', sql.NVarChar, class_name)
    .input('subject', sql.NVarChar, subject)
    .input('daily_point_cap', sql.Int, daily_point_cap)
    .query(`INSERT INTO Classes (class_name, subject, daily_point_cap)
      OUTPUT INSERTED.*
      VALUES (@class_name, @subject, @daily_point_cap)
      `);
    const createdClass = result.recordset[0];

    res.status(201).json({message: 'Class created successfully', class: createdClass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating class' });
  }
});

//Route to view class overview
router.get('/overview', async (req, res) => {
  const config = req.config;
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const pool = await getPool(config);

    const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT c.class_id, c.class_name, c.subject
      FROM UserClasses uc
      JOIN CLasses c ON uc.class_id = c.class_id
      WHERE uc.user_id = @user_id
      `);
      res.json({ classes: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching class overview' });
  }
});

// Route to get class information from id

router.get('/:class_id', async (req, res) => {
  const config = req.config;
  const classId = parseInt(req.params.class_id);

  if (isNaN(classId)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }
  
  try {
    const pool = await getPool(config);

    const result = await pool.request()
    .input('class_id', sql.Int, classId)
    .query('SELECT class_id, class_name, subject, daily_point_cap FROM Classes WHERE class_id = @class_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(result.recordset[0]);
  } catch {
    console.error(err);
    res.status(500).json({ message: 'Error fetching class info' });
  }
});

// Route to get members of a class and their rewards

router.get('/:class_id/members', async (req, res) => {
  const config = req.config;
  const classId = parseInt(req.params.class_id);

  if(isNaN(classId)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }
  // get list of all users
  try {
    const pool = await getPool(config);

    const result = await pool.request()
    .input('class_id', sql.Int, classId)
    .query(`
      SELECT u.user_id, u.username, u.is_teacher, u.points,
          r.reward_id, r.reward_name, r.description, r.point_cost
        FROM UserClasses uc
        JOIN Users u ON uc.user_id = u.user_id
        LEFT JOIN UserRewards ur ON u.user_id = ur.user_id AND ur.active = 1
        LEFT JOIN Rewards r ON ur.reward_id = r.reward_id
        WHERE uc.class_id = @class_id
        `);

        // group users and rewards
      const members = {};
      for (const row of result.recordset) {
        const uid = row.user_id;
        if (!members[uid]) {
          members[uid] = {
            user_id: uid,
            username: row.username,
            is_teacher: row.is_teacher,
            points: row.points,
            active_rewards: []
          };
        }

        if (row.reward_id) {
          members[uid].active_rewards.push({
            reward_id: row.reward_id,
            reward_name: row.reward_name,
            description: row.description,
            point_cost: row.point_cost
          });
        }
      }
      res.json(Object.values(members));
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error fetching class members' })
  }
});

// Route to remove a user from a class
router.delete('/:class_id/user/:user_id', async (req, res) => {
  const config = req.config;
  const classId = parseInt(req.params.class_id);
  const userIdToRemove = parseInt(req.params.user_id);

  if (isNaN(classId) || isNaN(userIdToRemove)) {
    return res.status(400).json({ message: 'Invalid class ID or user ID' });
  }

  try {
    const pool = await getPool(config);

    const checkResult = await pool.request()
    .input('class_id', sql.Int, classId)
    .input('user_id', sql.Int, userIdToRemove)
    .query(`
      SELECT * FROM UserClasses WHERE class_id = @class_id AND user_id = @user_id
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User is not in the class' });
    }

    await pool.request()
    .input('class_id', sql.Int, classId)
    .input('user_id', sql.Int, userIdToRemove)
    .query(`
      DELETE FROM UserClasses WHERE class_id = @class_id AND user_id = @user_id
      `);
    res.json({ message: 'User removed from class successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing user from class' });
  }
});


// Rotue to get full list of quizzes associated with a class

router.get('/:class_id/quizzes', async (req, res) => {
  const config = req.config;
  const classId = parseInt(req.params.class_id);

  if (isNaN(classId)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }

  try {
    const pool = await getPool(config);

    const result = await pool.request()
    .input('class_id', sql.Int, classId)
    .query(`
      SELECT quiz_id, title, description, release_timestamp, due_timestamp, target_score
      FROM Quizzes
      WHERE class_id = @class_id
      ORDER BY release_timestamp ASC
      `);
    res.json({ quizzes: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching quizzes for class' });
  }
});
module.exports = router;

