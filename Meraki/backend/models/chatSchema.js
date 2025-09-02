import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['student', 'instructor'], required: true }
    }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
        isRead: { type: Boolean, default: false },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  
    }]
});

export const Chat = mongoose.model('Chat', chatSchema);
