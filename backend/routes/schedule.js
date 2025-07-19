// 📁 routes/schedule.js

const express = require('express');
const router = express.Router();

// 🔹 Import the controller for handling job scheduling via POST
const { schedulePriceJobs } = require('../controllers/scheduleController');

// 🔹 Route: POST /schedule
// Accepts JSON body with token, network, and timestamp
router.post('/', schedulePriceJobs);

module.exports = router;
