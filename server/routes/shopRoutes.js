const express = require('express');
const sql = require('mssql');
const router = express.Router();

const getPool = async (config) => {
  if (!global.pool) {
    global.pool = await sql.connect(config);
  }
  return global.pool;
};

// Route to retrieve all rewards for a user
// If the user has the reward, it will be in the UserRewards table with an acquisition date
// Else acquisition date will return null
router.get('/rewards', async (req, res) => {
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
        SELECT r.reward_id, r.reward_name, r.reward_type_id, r.description, r.point_cost,
               ur.user_reward_id, ur.acquisition_date, ur.active
        FROM Rewards r
        LEFT JOIN UserRewards ur ON r.reward_id = ur.reward_id AND ur.user_id = @user_id
      `);

    console.log('Rewards fetched:', result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching rewards:', err);
    res.status(500).json({ message: 'Error fetching rewards' });
  }
});

// Route to purchase a reward
// Check if the user has enough points and if they already own the reward
// If they do not own it, insert into UserRewards and PointsHistory
// Deduct points from the user
router.post('/purchase', async (req, res) => {
  const config = req.config;
  const userId = req.session?.userId;
  const { reward_id } = req.body;  // Use request body for POST requests

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });
  if (!reward_id) return res.status(400).json({ message: 'Missing reward_id' });

  try {
    const pool = await getPool(config);

    // Check if the reward exists
    const rewardResult = await pool.request()
      .input('reward_id', sql.Int, reward_id)
      .query('SELECT * FROM Rewards WHERE reward_id = @reward_id');

    const reward = rewardResult.recordset[0];
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    // Check if the user already owns the reward
    const userRewardResult = await pool.request()
      .input('user_id', sql.Int, userId)
      .input('reward_id', sql.Int, reward_id)
      .query(`
        SELECT * 
        FROM UserRewards 
        WHERE user_id = @user_id AND reward_id = @reward_id AND acquisition_date IS NOT NULL
      `);

    if (userRewardResult.recordset.length > 0) {
      return res.status(400).json({ message: 'You already own this reward' });
    }

    const userPoints = await pool.request()
      .input('user_id', sql.Int, userId)
      .query('SELECT points FROM Users WHERE user_id = @user_id');

    const currentPoints = userPoints.recordset[0]?.points ?? 0;
    if (currentPoints < reward.point_cost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    // Deduct points from the user
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('cost', sql.Int, reward.point_cost)
      .query('UPDATE Users SET points = points - @cost WHERE user_id = @user_id');

    // Purchase the reward
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('reward_id', sql.Int, reward_id)
      .query(`
        INSERT INTO UserRewards (user_id, reward_id, acquisition_date, active)
        VALUES (@user_id, @reward_id, GETDATE(), 0)
      `);

    // Insert into PointsHistory to log the transaction
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('delta', sql.Int, -reward.point_cost)
      .input('desc', sql.NVarChar, `Purchased reward: ${reward.reward_name}`)
      .query(`
        INSERT INTO PointsHistory (user_id, points_delta, transaction_timestamp, description)
        VALUES (@user_id, @delta, GETDATE(), @desc)
      `);

    res.status(200).json({ message: 'Reward purchased successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error purchasing reward' });
  }
});

// Route to activate a reward
router.post('/activate', async (req, res) => {
  const config = req.config;
  const userId = req.session?.userId;
  const { user_reward_id } = req.body;

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });
  if (!user_reward_id) return res.status(400).json({ message: 'Missing user_reward_id' });

  try {
    const pool = await getPool(config);

    // Check if the reward exists and is owned by the user
    const rewardCheck = await pool.request()
      .input('user_reward_id', sql.Int, user_reward_id)
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT ur.reward_id, r.reward_type_id
        FROM UserRewards ur
        JOIN Rewards r ON ur.reward_id = r.reward_id
        WHERE ur.user_reward_id = @user_reward_id AND ur.user_id = @user_id
      `);

    const reward = rewardCheck.recordset[0];
    if (!reward) return res.status(404).json({ message: 'Reward not owned by user' });

    const { reward_type_id } = reward;

    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const request = transaction.request();

    // Deactivate other rewards of the same type
    await request
      .input('user_id', sql.Int, userId)
      .input('type', sql.Int, reward_type_id)
      .query(`
        UPDATE ur
        SET ur.active = 0
        FROM UserRewards ur
        JOIN Rewards r ON ur.reward_id = r.reward_id
        WHERE ur.user_id = @user_id AND r.reward_type_id = @type
      `);

    // Activate selected reward
    await request
      .input('user_reward_id', sql.Int, user_reward_id)
      .query(`
        UPDATE UserRewards SET active = 1 WHERE user_reward_id = @user_reward_id
      `);

    await transaction.commit();
    res.status(200).json({ message: 'Reward activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error activating reward' });
  }
});

module.exports = router;