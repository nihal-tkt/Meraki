import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    submissionLink: { type: String }, 
    submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        link: { type: String }, // URL of the submitted file
        submittedAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment',assignmentSchema);
