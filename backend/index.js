// backend/index.js

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

// 🔹 MongoDB Config
mongoose.set('strictQuery', false); // optional: suppress deprecation warning
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected (Atlas)');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// 🔹 Base Route for Friendly Landing
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Backend is running. Use /api/* routes.' });
});

// 🔹 Health Check Routes
app.get('/api/ping', (_, res) => {
  res.status(200).json({ message: 'pong from Vercel' });
});

app.get('/api/test-db', (_, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({ mongoConnected: isConnected });
});

// 🔹 Modular Routes
app.use('/api/price', require('./routes/price'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/birthdate', require('./routes/birthdate'));

// 🔹 Vercel Serverless Export
const serverless = require('serverless-http');
module.exports = serverless(app);
