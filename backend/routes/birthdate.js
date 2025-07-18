// 📁 routes/birthdate.js

const express = require('express');
const router = express.Router();

// Import the controller that handles birthdate logic
const { getBirthdate } = require('../controllers/birthdateController');

// 🔹 Route: GET /birthdate?token=...&network=...
// This calls the controller to fetch the token's birthdate
router.get('/', getBirthdate);

module.exports = router;
