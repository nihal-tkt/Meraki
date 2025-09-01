import express from 'express';
import upload from "../middleware/multer.js";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getEnrolledStudents,
    searchCourses
} from '../controllers/courseController.js'; 
import {authMiddleware} from '../middleware/authMiddleware.js'; 
import {roleMiddleware} from '../middleware/roleMiddleware.js'; 

const router = express.Router();

router.get('/search',searchCourses);

// Create a new course (accessible only by instructors)
router.post('/create', authMiddleware, roleMiddleware('instructor'), upload.single('thumbnail'), createCourse);

// Get all courses (accessible by everyone)
router.get('/', authMiddleware, getAllCourses);

// Get a specific course by ID (accessible by everyone)
router.get('/:courseId', authMiddleware, getCourseById);


// Enroll in a course (accessible only by students)
router.post('/:courseId/enroll', authMiddleware, roleMiddleware('student'), enrollInCourse);

// Get all enrolled students in a course (accessible only by instructors)
router.get('/:courseId/enrolled-students', authMiddleware, roleMiddleware('instructor'), getEnrolledStudents);

export default router;
