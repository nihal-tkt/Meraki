import express from 'express';
import { addReview, getCourseReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();

// Route for students to add a review to a course
router.post(
    '/:courseId',
    authMiddleware,
    roleMiddleware('student'),
    addReview
);

// Route for all authenticated users to view reviews for a course
router.get(
    '/:courseId',
    authMiddleware,
    getCourseReviews
);

// Route for students to update their own review on a course
router.put(
    '/:courseId/:reviewId',
    authMiddleware,
    roleMiddleware('student'),
    updateReview
);

// Route for students to delete their own review on a course
router.delete(
    '/:courseId/:reviewId',
    authMiddleware,
    roleMiddleware('student'),
    deleteReview
);

export default router;
