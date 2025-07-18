// 📁 server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// 🔹 Middleware to parse JSON bodies
app.use(express.json());

// 🔹 Connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (server)'))
  .catch((err) => console.error('❌ MongoDB error (server):', err));

// 🔹 Health check route to verify DB connection
app.get('/test-db', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ mongoConnected: isConnected });
});

// 🔹 Mount modular routes
app.use('/price', require('./routes/price'));         // GET /price
app.use('/schedule', require('./routes/schedule'));   // GET /schedule
app.use('/birthdate', require('./routes/birthdate')); // GET /birthdate

// 🔹 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
