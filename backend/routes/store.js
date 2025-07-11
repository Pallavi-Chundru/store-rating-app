const express = require('express');
const router = express.Router();
const pool = require('../db');

// Public route to list all stores
router.get('/', async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.address,
        (SELECT ROUND(AVG(rating),1) FROM ratings WHERE store_id = s.id) AS average_rating
      FROM stores s
    `);

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

module.exports = router;
