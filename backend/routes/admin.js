const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// Apply middleware for all admin routes
router.use(authenticateToken);
router.use(authorizeRoles(['admin']));

// Dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [stores] = await pool.query('SELECT COUNT(*) AS total_stores FROM stores');
    const [ratings] = await pool.query('SELECT COUNT(*) AS total_ratings FROM ratings');

    res.json({
      total_users: users[0].total_users,
      total_stores: stores[0].total_stores,
      total_ratings: ratings[0].total_ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

// Filter and list all users
router.get('/users', async (req, res) => {
  const { name = '', email = '', address = '', role = '' } = req.query;

  try {
    const [users] = await pool.query(`
      SELECT id, name, email, address, role FROM users
      WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?
    `, [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// List all stores
router.get('/stores', async (req, res) => {
  const { name = '', email = '', address = '' } = req.query;

  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.email, s.address,
        (SELECT ROUND(AVG(rating),1) FROM ratings WHERE store_id = s.id) AS average_rating
      FROM stores s
      WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
    `, [`%${name}%`, `%${email}%`, `%${address}%`]);

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Add new user (admin can add users)
router.post('/add-user', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, address, role]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

module.exports = router;
