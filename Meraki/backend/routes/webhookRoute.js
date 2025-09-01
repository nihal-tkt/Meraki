import express from 'express';
import { stripeWebhook } from '../controllers/stripeController.js';

const router = express.Router();

// Stripe webhook route
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
