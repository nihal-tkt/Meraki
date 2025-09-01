import express from "express";
import upload from "../middleware/multer.js";
import { 
    logoutUser, 
    getEnrolledCourses, 
    getUserProfile, 
    getCreatedCourses, 
    updateUserProfile 
} from '../controllers/userController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
// import { validateRegister } from "../middleware/validateRegister.js";
// import { validateLogin } from "../middleware/validateLogin.js";

const router = express.Router();

// // Route to register a user
// router.post('/register', validateRegister, registerUser);

// // Route to login a user
// router.post('/login', validateLogin, loginUser);

// Route to logout a user
router.post('/logout', authMiddleware, logoutUser);

// Route to get enrolled courses (for students only)
router.get('/enrolled-courses', authMiddleware, roleMiddleware('student'), getEnrolledCourses);

// Route to get the user profile (for authenticated users)
router.get('/profile', authMiddleware, getUserProfile);

// Route to get created courses (for instructors only)
router.get('/created-courses', authMiddleware, roleMiddleware('instructor'), getCreatedCourses);

// Route to update user profile (for authenticated users)
router.put('/update-profile', authMiddleware, upload.single('profilePhoto'), updateUserProfile);

export default router;