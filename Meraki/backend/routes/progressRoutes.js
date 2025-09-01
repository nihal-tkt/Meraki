import express from 'express';
import { updateCourseProgress, getCourseProgress } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Route to update a student's course progress
router.put('/:studentId/:courseId', authMiddleware, roleMiddleware('student'), updateCourseProgress);

// Route to get a student's course progress
router.get('/:studentId/:courseId', authMiddleware, roleMiddleware('student'), getCourseProgress);

export default router;
