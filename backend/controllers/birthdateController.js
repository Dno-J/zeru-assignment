// 📁 controllers/birthdateController.js

// Import the service that provides token birthdates
const { getTokenBirthdate } = require('../services/birthdateService');

// Controller to handle GET /birthdate?token=...&network=...
exports.getBirthdate = async (req, res) => {
  const { token, network } = req.query;

  console.log('🌐 Incoming /birthdate request:', { token, network });

  // Validate query parameters
  if (!token || !network) {
    return res.status(400).json({ error: 'Missing token or network' });
  }

  try {
    // Fetch birthdate from service
    const timestamp = await getTokenBirthdate(token, network);

    // Respond with birthdate (timestamp)
    res.json({ birthdate: timestamp });
  } catch (err) {
    console.error('❌ Birthdate fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch birthdate' });
  }
};
