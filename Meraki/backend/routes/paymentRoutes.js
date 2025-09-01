import express from 'express';
import { createPaymentIntent, createCheckoutSession, verifyPaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

router.post('/create-checkout-session', createCheckoutSession);

router.post('/verify-payment', verifyPaymentStatus);

export default router;
