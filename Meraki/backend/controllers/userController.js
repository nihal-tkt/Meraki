import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import { User } from '../models/userSchema.js';
import { Course } from '../models/courseSchema.js';
import cloudinary from '../utils/cloudinary.js';

export const registerUser = async (req, res) => {
    // Validation checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash and salt the password with 10 rounds
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this is securely set in your environment

export const loginUser = async (req, res) => {
    // Validation checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Enter password or login via socials.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' } // Adjust expiration as needed
        );

        // Optionally, set token as a cookie (if using cookies for auth)
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({ message: 'Login successful', token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

export const logoutUser = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,      // Only accessible by the web server
        secure: true,        // Ensures cookie is sent over HTTPS
        sameSite: 'strict'   // Prevents CSRF attacks
    });

    // Send a success response
    res.status(200).json({ message: 'Logout successful' });
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const enrolledCourses = await Course.find({ enrolledStudents: req.user.id }).populate('instructor', 'fullName profilePhoto');

        res.status(200).json({ enrolledCourses });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving enrolled courses', error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
};

export const getCreatedCourses = async (req, res) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ message: 'Only instructors can create and view their own courses' });
    }

    try {
        const createdCourses = await Course.find({ instructor: req.user.id });

        res.status(200).json({ createdCourses });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving created courses', error: error.message });
    }
};


export const updateUserProfile = async (req, res) => {
    const { fullName, email, bio, skills } = req.body;
    let profilePhotoUrl = req.file?.path; 
    console.log(req.file);
    console.log(req.body);

    try {
        

        // Build update object dynamically based on provided fields
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;
        if (bio) updateFields.bio = bio;
        if (skills) updateFields.skills = Array.isArray(skills) ? skills : skills.split(',').map((skill) => skill.trim());
        if (profilePhotoUrl) updateFields.profilePhoto = profilePhotoUrl;

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};