// 📁 routes/price.js

const express = require('express');
const router = express.Router();

// Import the controller that handles price fetching
const { getLatestPrice } = require('../controllers/priceController');

// 🔹 Route: GET /price?token=...&network=...
// This returns the latest stored price for a token on a network
router.get('/', getLatestPrice);

module.exports = router;
