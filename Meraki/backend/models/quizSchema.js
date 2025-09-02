import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: String },
    }],
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz',quizSchema);
