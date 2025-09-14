// utils/socketHandler.js
import { Chat } from "../models/chatSchema.js";
import { Course } from "../models/courseSchema.js";
import { User } from "../models/userSchema.js";
import cloudinary from "./cloudinary.js";

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Join a chat room for a specific course
        

        // Handle receiving messages from users and broadcast to course chat room
        socket.on('sendMessage', async (courseId, userId, messageText) => {
            // Validate user and course
            const course = await Course.findById(courseId);
            if (!course) {
                socket.emit('error', { message: 'Course not found' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                socket.emit('error', { message: 'User not found' });
                return;
            }

            // Create the message object
            const message = {
                sender: userId,
                message: messageText,
                timestamp: new Date()
            };

            // Save the message in the database
            let chat = await Chat.findOne({ course: courseId });
            if (!chat) {
                chat = new Chat({ course: courseId, messages: [] });
            }
            chat.messages.push(message);
            await chat.save();

            // Broadcast the message to all clients in the course chat room
            io.to(courseId).emit('receiveMessage', {
                sender: user.fullName,
                message: messageText,
                timestamp: message.timestamp
            });
        });

        // Handle receiving file uploads from users and broadcast to course chat room
        socket.on('sendFile', async (courseId, userId, fileData, fileName, fileType) => {
            // Validate user and course
            const course = await Course.findById(courseId);
            if (!course) {
                socket.emit('error', { message: 'Course not found' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                socket.emit('error', { message: 'User not found' });
                return;
            }

            // Upload file to Cloudinary
            cloudinary.uploader.upload(fileData, { resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    socket.emit('error', { message: 'File upload failed' });
                    return;
                }

                const fileUrl = result.secure_url; // Cloudinary file URL

                // Optionally, save file metadata in the database
                let chat = await Chat.findOne({ course: courseId });
                if (!chat) {
                    chat = new Chat({ course: courseId, messages: [] });
                }

                // Save file message in the chat
                chat.messages.push({
                    sender: userId,
                    message: fileUrl,
                    fileName: fileName,
                    fileType: fileType,
                    timestamp: new Date(),
                });
                await chat.save();

                // Broadcast the file URL to all clients in the course chat room
                io.to(courseId).emit('receiveFile', {
                    sender: user.fullName,
                    fileUrl: fileUrl,
                    fileName: fileName,
                    timestamp: new Date(),
                });
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};