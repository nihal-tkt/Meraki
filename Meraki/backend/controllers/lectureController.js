import { Course } from "../models/courseSchema.js";
import cloudinary from "../utils/cloudinary.js"

export const addLectureToCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description } = req.body;

    try {
        // Check if the instructor owns the course
        const course = await Course.findById(courseId).populate('instructor');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        

        if (course.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to add lecture to this course' });
        }

        // Ensure a file is uploaded
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Upload lecture to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { 
            folder: 'media',
            resource_type: 'auto'
        });

        // Add lecture details to the course
        course.lectures.push({ url: result.secure_url, title, description });
        await course.save();


        res.status(200).json({ message: 'Lecture added successfully', lectures: course.lectures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the lecture' });
    }
};

export const getCourseLectures = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('enrolledStudents');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        console.log(course);

        // Check if the user is enrolled
        const isEnrolled = course.enrolledStudents.some(student => student._id.toString() === req.user._id.toString());
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not authorized to view these lectures' });
        }

        // Sort lectures by createdAt (earliest first)
        const sortedLectures = course.lectures.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.status(200).json({ lectures: course.lectures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the lectures' });
    }
};

