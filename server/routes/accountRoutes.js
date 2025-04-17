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

// Route to register a new user
router.post('/register', async (req, res) => {
  const { username, password, is_teacher } = req.body;
  const config = req.config;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const pool = await getPool(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password_sha256', sql.NVarChar, hashedPassword)
      .input('is_teacher', sql.Int, is_teacher)
      .input('points', sql.Int, 0)
      .query('INSERT INTO Users (username, password_sha256, is_teacher, points) VALUES (@username, @password_sha256, @is_teacher, @points)');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during registration');
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { username, password, is_teacher } = req.body;
  const config = req.config;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const pool = await getPool(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    if (!user.password_sha256) {
      return res.status(401).json({ message: 'Invalid credentials (password missing)' });
    }

    // Trim spaces from the stored password hash (or else causes problems with route)
    const storedPasswordHash = user.password_sha256.trim();

    const isMatch = await bcrypt.compare(password, storedPasswordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user info in session after successful login
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});


// Route to fetch logged-in user details
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { userId, username } = req.session;
  res.json({ userId, username });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;