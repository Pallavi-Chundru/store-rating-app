const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

router.use(authenticateToken);
router.use(authorizeRoles(['store_owner']));

// View users who rated this owner's store
router.get('/ratings', async (req, res) => {
  try {
    const [ratings] = await pool.query(`
      SELECT u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = ?
    `, [req.user.id]);

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load ratings' });
  }
});

// Get average rating of the owner's store
router.get('/average-rating', async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT ROUND(AVG(r.rating),1) AS average_rating
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = ?
    `, [req.user.id]);

    res.json({ average_rating: result[0].average_rating || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get average rating' });
  }
});

module.exports = router;
