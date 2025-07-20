// backend/api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
}));

// 🔹 MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (Atlas)'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// 🔹 Health + Friendly Landing
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Backend is running. Use /api/* routes.' });
});
app.get('/api/ping', (_, res) => {
  res.status(200).json({ message: 'pong from Vercel' });
});
app.get('/api/test-db', (_, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({ mongoConnected: isConnected });
});

// 🔹 Modular Routes
app.use('/api/price', require('../routes/price'));
app.use('/api/schedule', require('../routes/schedule'));
app.use('/api/birthdate', require('../routes/birthdate'));

// 🔹 Export for Vercel
const serverless = require('serverless-http');
module.exports = serverless(app);
