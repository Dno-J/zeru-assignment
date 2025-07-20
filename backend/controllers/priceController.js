// 📁 controllers/priceController.js

import PriceModel from '../models/Price.js';

export async function getLatestPrice(req, res) {
  const { token, network } = req.query;

  if (!token || !network) {
    return res.status(400).json({ error: 'Missing token or network in query' });
  }

  try {
    const latestPrice = await PriceModel.findOne({
      token: token.toLowerCase(),
      network: network.toLowerCase(),
    }).sort({ timestamp: -1 });

    if (!latestPrice) {
      return res.status(404).json({ error: 'Price not found' });
    }

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
}
