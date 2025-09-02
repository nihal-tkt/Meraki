import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'instructor'], required: true },
    profilePhoto: { type: String, default: 'https://res.cloudinary.com/djod94xyg/image/upload/v1734966890/images/c7okx8pi2l3mhwjuoyvb.jpg' }, // Cloudinary URL
    bio: { type: String },
    skills: [String],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // For students
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // For instructors
    googleId: { type: String }, // For Google login
    facebookId: { type: String } // For Facebook login
    
}, { timestamps: true });

export const User = mongoose.model('User',userSchema);
