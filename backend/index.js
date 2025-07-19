// 📁 index.js (Vercel-Ready, Cleaned)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config(); // Load .env variables in local dev

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));

// 🔹 DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// 🔹 Health Check Route
app.get('/api/test-db', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ mongoConnected: isConnected });
});

// 🔹 App Routes (modular)
app.use('/api/price', require('./routes/price'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/birthdate', require('./routes/birthdate'));

// 🔹 Export as serverless function
module.exports = serverless(app);
