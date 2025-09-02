import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLectures: [{ type: String }], // Track completed video URLs
    percentageComplete: { type: Number, default: 0 },
}, { timestamps: true });

export const Progress = mongoose.model('Progress',progressSchema);
