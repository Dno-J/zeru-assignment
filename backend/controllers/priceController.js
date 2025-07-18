// 📁 controllers/priceController.js

const PriceModel = require('../models/Price');

// Controller to handle GET /price?token=...&network=...
exports.getLatestPrice = async (req, res) => {
  const { token, network } = req.query;

  // Validate query parameters
  if (!token || !network) {
    return res.status(400).json({ error: 'Missing token or network in query' });
  }

  try {
    // Query MongoDB for the latest price entry
    const latestPrice = await PriceModel.findOne({
      token: token.toLowerCase(),
      network: network.toLowerCase(),
    }).sort({ timestamp: -1 });

    // If no price found, return 404
    if (!latestPrice) {
      return res.status(404).json({ error: 'Price not found' });
    }

    // Respond with the latest price data
    res.json({
      token: latestPrice.token,
      network: latestPrice.network,
      price: latestPrice.price,
      timestamp: latestPrice.timestamp,
    });
  } catch (err) {
    console.error('❌ Error fetching price:', err);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};
