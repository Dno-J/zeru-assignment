// 📁 routes/birthdate.js

import express from 'express';
import { getBirthdate } from '../controllers/birthdateController.js';

const router = express.Router();

router.get('/', getBirthdate);

export default router;
