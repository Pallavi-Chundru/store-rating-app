const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authenticateToken = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');
const ratingRoutes = require('./routes/rating');
const ownerRoutes = require('./routes/owner');
const adminRoutes = require('./routes/admin');

const app = express();
dotenv.config();
const pool = require('./db');

// MySQL connection test
pool.getConnection()
  .then(conn => {
    console.log("MySQL Database connected successfully.");
    conn.release();
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err.message);
  });
  
// Middleware
app.use(cors());
app.use(express.json()); // ✅ Use this instead of body-parser

// Routes
app.use('/api/auth', authRoutes); // ✅ Public route

// Protected Routes
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/stores', authenticateToken, storeRoutes);
app.use('/api/ratings', authenticateToken, ratingRoutes);
app.use('/api/owner', authenticateToken, ownerRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
