const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

router.use(authenticateToken);
router.use(authorizeRoles(['user']));

// Get all stores with optional search
router.get('/stores', async (req, res) => {
  const { name = '', address = '' } = req.query;

  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.address,
        (SELECT ROUND(AVG(rating),1) FROM ratings WHERE store_id = s.id) AS overall_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS user_rating
      FROM stores s
      WHERE s.name LIKE ? AND s.address LIKE ?
    `, [req.user.id, `%${name}%`, `%${address}%`]);

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Submit a rating
router.post('/rate/:storeId', async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;

  try {
    await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating)
    `, [req.user.id, storeId, rating]);

    res.json({ message: 'Rating submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router;
