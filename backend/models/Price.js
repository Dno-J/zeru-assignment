// 📁 models/Price.js

import mongoose from 'mongoose';

// 🔹 Define the schema for storing token price data
const priceSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true, // Token symbol or address (e.g. 'usdt', 'weth')
  },
  network: {
    type: String,
    required: true, // Blockchain network (e.g. 'ethereum')
  },
  price: {
    type: String,
    required: true, // Price value as a string (e.g. '1.711')
  },
  timestamp: {
    type: Date,
    required: true, // When the price was recorded
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// 🔹 Export the model so it can be used in controllers and workers
const PriceModel = mongoose.model('Price', priceSchema);
export default PriceModel;
