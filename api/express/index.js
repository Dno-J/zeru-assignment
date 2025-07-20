// 📁 api/index.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import priceRoutes from '../backend/routes/price.js';
import scheduleRoutes from '../backend/routes/schedule.js';
import birthdateRoutes from '../backend/routes/birthdate.js';

dotenv.config();

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
app.use('/api/price', priceRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/birthdate', birthdateRoutes);

// 🔹 Export for Vercel
export default serverless(app);
