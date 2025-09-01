import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js'; 
import { getChat, sendMessage, getUnreadChats, markMessagesAsRead, getAllChats } from '../controllers/chatController.js';

const router = express.Router();

//get the chat
router.get('/:courseId', authMiddleware, getChat);

//send message
router.post('/:courseId/send-message', authMiddleware, sendMessage);

//get unread chats
router.get('/:courseId/unread-message', authMiddleware, getUnreadChats);

//mark chats as read
router.patch('/:courseId/mark-read', authMiddleware, markMessagesAsRead);

router.get('/:courseId/all-chats', authMiddleware, getAllChats);

export default router;