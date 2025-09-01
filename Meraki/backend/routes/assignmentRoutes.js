import express from 'express';
import {
    createAssignment,
    getAssignmentsByCourse,
    submitAssignment,
    deleteAssignment,
    updateAssignment
} from '../controllers/assignmentController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Route to create a new assignment (accessible only by instructors)
router.post('/:courseId/create', authMiddleware, roleMiddleware('instructor'), upload.single('file') ,createAssignment);

// Route to fetch all assignments for a specific course (accessible by both students and instructors)
router.get('/:courseId', authMiddleware, getAssignmentsByCourse);

// Route to submit an assignment (accessible only by students)
router.post('/:courseId/:assignmentId/submit', authMiddleware, roleMiddleware('student'),upload.single('file') , submitAssignment);

// Route to delete an assignment (accessible only by instructors)
router.delete('/:assignmentId', authMiddleware, roleMiddleware('instructor'), deleteAssignment);

// Route to update an assignment (accessible only by instructors)
router.put('/:assignmentId', authMiddleware, roleMiddleware('instructor'),upload.single('file') , updateAssignment);

export default router;
