// 📁 controllers/birthdateController.js

import { getTokenBirthdate } from '../services/birthdateService.js';

export async function getBirthdate(req, res) {
  const { token, network } = req.query;

  console.log('🌐 Incoming /birthdate request:', { token, network });

  if (!token || !network) {
    return res.status(400).json({ error: 'Missing token or network' });
  }

  try {
    const timestamp = await getTokenBirthdate(token, network);
    res.json({ birthdate: timestamp });
  } catch (err) {
    console.error('❌ Birthdate fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch birthdate' });
  }
}
