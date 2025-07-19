// 📁 index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected (Atlas)');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// 🔹 Health Check
app.get('/api/test-db', (_, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({ mongoConnected: isConnected });
});

// 🔹 Basic Ping
app.get('/api/ping', (_, res) => {
  res.status(200).json({ message: 'pong from Vercel' });
});

// 🔹 Modular Routes
app.use('/api/price', require('./routes/price'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/birthdate', require('./routes/birthdate'));

// 🔹 Vercel Export
// ⛳ Change this from "module.exports = serverless(app);" to:
const serverless = require('serverless-http');
module.exports = app;
module.exports.handler = serverless(app);
