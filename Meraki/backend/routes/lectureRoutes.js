import express from 'express';
import upload from "../middleware/multer.js";
import {authMiddleware} from '../middleware/authMiddleware.js'; 
import {roleMiddleware} from '../middleware/roleMiddleware.js'; 
import { addLectureToCourse, getCourseLectures } from '../controllers/lectureController.js';

const router = express.Router();

router.post('/:courseId/upload', authMiddleware, roleMiddleware('instructor'), upload.single('lecture'), addLectureToCourse);

router.get('/:courseId', authMiddleware, getCourseLectures);

export default router;