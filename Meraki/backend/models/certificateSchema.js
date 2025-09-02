import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateUrl: { type: String }, // URL to the generated certificate PDF
}, { timestamps: true });

export const Certificate = mongoose.model('Certificate',certificateSchema);
