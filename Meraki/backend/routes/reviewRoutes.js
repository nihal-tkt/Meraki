import express from 'express';
import { addReview, getCourseReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();



// Route for students to delete their own review on a course
router.delete(
    '/:courseId/:reviewId',
    authMiddleware,
    roleMiddleware('student'),
    deleteReview
);

export default router;
