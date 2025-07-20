// 📁 routes/price.js

import express from 'express';
import { getLatestPrice } from '../controllers/priceController.js';

const router = express.Router();

router.get('/', getLatestPrice);

export default router;
