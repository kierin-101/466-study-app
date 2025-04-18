const express = require('express');
const cors = require('cors');
const session = require('express-session');
const sql = require('mssql');
const accountRoutes = require('./routes/accountRoutes');
const classRoutes = require('./routes/classRoutes');
const quizRoutes = require('./routes/quizRoutes');
const app = express();

require('dotenv').config({ path: __dirname + '/.env' });
app.use(express.json());
// Database connection configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Middleware to pass config to routes
app.use((req, res, next) => {
  req.config = config;
  next();
});

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 3600000 }
  })
);

// Routes
app.use('/api/account', accountRoutes);
app.use('/api/class', classRoutes);
app.use('/api/quiz', quizRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
