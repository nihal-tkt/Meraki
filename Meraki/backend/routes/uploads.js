import express from 'express';
import upload from '../middleware/multer.js';
import { updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/updateProfile', upload.single('profilePhoto'), updateUserProfile);
export default router;
