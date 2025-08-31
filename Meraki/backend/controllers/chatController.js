import { Chat } from "../models/chatSchema.js";
import { Course } from "../models/courseSchema.js";
import { User } from "../models/userSchema.js";

// Create or fetch a chat for a specific course
export const getChat = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check if the user is enrolled in the course or the instructor
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const isEnrolled = course.enrolledStudents.includes(userId);
        const isInstructor = course.instructor.toString() === userId;

        if (!isEnrolled && !isInstructor) {
            return res.status(403).json({ message: "You are not authorized to access this chat" });
        }

        let chat = await Chat.findOne({ course: courseId });
        if (!chat) {
            chat = new Chat({
                course: courseId,
                participants: [
                    { user: course.instructor, role: 'instructor' },
                    ...course.enrolledStudents.map(student => ({ user: student, role: 'student' }))
                ]
            });
            await chat.save();
        }

        return res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send a message in a specific chat
export const sendMessage = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        // Check if the user is part of the course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const isEnrolled = course.enrolledStudents.includes(userId);
        const isInstructor = course.instructor.toString() === userId;

        if (!isEnrolled && !isInstructor) {
            return res.status(403).json({ message: "You are not authorized to send messages in this chat" });
        }

        let chat = await Chat.findOne({ course: courseId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if the sender is a valid user (ensure sender exists)
        const sender = await User.findById(userId);
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        // Add the new message to the chat
        chat.messages.push({
            sender: userId,
            message,
            timestamp: new Date()
        });

        await chat.save();
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUnreadChats = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Fetch the course to verify its existence
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check if the user is the instructor or a student enrolled in the course
        const isInstructor = course.instructor.toString() === userId;
        const isStudent = course.enrolledStudents.includes(userId); // Assuming enrolledStudents is an array of student IDs

        if (!isInstructor && !isStudent) {
            return res.status(403).json({ message: "You are not authorized to access this information" });
        }

        // Fetch the chat for the course
        const chat = await Chat.findOne({ course: courseId }).populate('messages.sender', 'fullName profilePhoto');
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Filter unread messages grouped by sender
        const unreadMessages = {};
        chat.messages.forEach(message => {
            if (!message.readBy.includes(userId)) { // Check if the message is unread and is directed to the current user
                const senderId = message.sender._id.toString();
                if (!unreadMessages[senderId]) {
                    unreadMessages[senderId] = {
                        sender: message.sender,
                        messages: []
                    };
                }
                unreadMessages[senderId].messages.push(message);
            }
        });

        return res.status(200).json(Object.values(unreadMessages));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const markMessagesAsRead = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { messageIds } = req.body; // Get message IDs from request body
        const userId = req.user.id; // Extract userId from the authenticated user

        // Find the chat related to the course
        const chat = await Chat.findOne({ course: courseId });
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        let messagesUpdated = false;

        // Loop through messages and mark as read if the message ID matches and the user is not already in readBy
        chat.messages.forEach((message) => {
            if (messageIds.includes(message._id.toString()) && !message.readBy.includes(userId)) {
                message.readBy.push(userId); // Add userId to the 'readBy' array
                messagesUpdated = true; // Mark that a message was updated
            }
        });

        // Save the chat if any messages were updated
        if (messagesUpdated) {
            await chat.save();
            return res.status(200).json({ message: "Messages marked as read" });
        } else {
            return res.status(200).json({ message: "No new messages to mark as read" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getAllChats = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the chat for the course
        const chat = await Chat.findOne({ course: courseId }).populate('participants.user', 'fullName profilePhoto');
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Get a list of all participants who have sent messages
        const allChats = chat.messages.map(message => message.sender.toString());
        const uniqueChats = [...new Set(allChats)];

        const chatParticipants = chat.participants.filter(participant =>
            uniqueChats.includes(participant.user._id.toString())
        );

        return res.status(200).json(chatParticipants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

