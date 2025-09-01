import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js'; 
import {roleMiddleware} from '../middleware/roleMiddleware.js'; 
import { addToCart, removeFromCart, getCartItems } from '../controllers/cartController.js';

const router = express.Router();

//route to add item to cart
router.post('/add/:courseId', authMiddleware, roleMiddleware('student'), addToCart);

// Route to remove a course from the cart
router.delete('/remove/:courseId', authMiddleware, roleMiddleware('student'), removeFromCart);

// Route to get all items in the student's cart
router.get('/', authMiddleware, roleMiddleware('student'), getCartItems);

export default router;