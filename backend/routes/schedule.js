// 📁 routes/schedule.js

const express = require('express');
const router = express.Router();

// Import the controller that schedules price jobs
const { schedulePriceJobs } = require('../controllers/scheduleController');

// 🔹 Route: GET /schedule?token=...&network=...
// This triggers BullMQ jobs to fetch and store prices
router.get('/', schedulePriceJobs);

module.exports = router;
