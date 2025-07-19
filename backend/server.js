// 📁 server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// 🔹 Parse incoming JSON
app.use(express.json());

// 🔹 Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // Adjust for deployment if needed
}));

// 🔹 Connect to MongoDB using env variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (server)'))
  .catch((err) => console.error('❌ MongoDB error (server):', err));

// 🔹 Health check endpoint
app.get('/test-db', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ mongoConnected: isConnected });
});

// 🔹 Modular route handlers
app.use('/price', require('./routes/price'));         // Handles GET /price
app.use('/schedule', require('./routes/schedule'));   // Handles POST /schedule
app.use('/birthdate', require('./routes/birthdate')); // Handles GET /birthdate

// 🔹 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
