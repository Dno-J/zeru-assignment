import express from 'express';
import { schedulePriceJobs } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/', schedulePriceJobs);

export default router;
