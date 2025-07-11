const express = require('express');
const pool = require('../db'); // MySQL connection
const router = express.Router();

// Submit or update a rating
router.post('/', async (req, res) => {
  const { store_id, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    // Use MySQL UPSERT via ON DUPLICATE KEY
    const [result] = await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating)
    `, [req.user.id, store_id, rating]);

    res.status(201).json({ message: 'Rating submitted/updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error submitting rating' });
  }
});

// Get store details with the average rating and user's rating
router.get('/store/:storeId', async (req, res) => {
  const { storeId } = req.params;

  try {
    const [storeDetails] = await pool.query(`
      SELECT 
        s.*,
        (SELECT ROUND(AVG(r.rating), 2) FROM ratings r WHERE r.store_id = s.id) AS avg_rating,
        (SELECT r.rating FROM ratings r WHERE r.store_id = s.id AND r.user_id = ?) AS user_rating
      FROM stores s
      WHERE s.id = ?
    `, [req.user.id, storeId]);

    if (storeDetails.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(storeDetails[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching store info' });
  }
});

module.exports = router;
