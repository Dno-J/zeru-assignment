const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/api/ping', (_, res) => {
  res.json({ message: 'pong from Vercel' });
});

module.exports = serverless(app);
