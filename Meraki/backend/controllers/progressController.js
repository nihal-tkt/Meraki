import { Progress } from '../models/progressSchema.js';

export const updateCourseProgress = async (req, res) => {
    const { courseId, studentId } = req.params; // Course ID and Student ID from URL parameters
    const { completedLectures, percentageComplete } = req.body; // Capture data from request body

    try {
        // Find the progress document for the given student and course
        const progress = await Progress.findOne({ student: studentId, course: courseId });

        if (progress) {
            // Update the existing progress document
            progress.completedLectures = completedLectures; // Update completed lectures
            progress.percentageComplete = percentageComplete; // Update percentage complete
            await progress.save(); // Save the updated document

            return res.status(200).json({ message: 'Progress updated successfully', progress });
        } else {
            // If no progress exists, create a new document
            const newProgress = new Progress({
                student: studentId,
                course: courseId,
                completedLectures,
                percentageComplete,
            });

            await newProgress.save(); // Save the new document
            return res.status(201).json({ message: 'Progress created successfully', progress: newProgress });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating course progress', error: error.message });
    }
};

export const getCourseProgress = async (req, res) => {
    const { studentId, courseId } = req.params; // Extract studentId and courseId from URL parameters

    try {
        // Find the progress document for the given student and course
        const progress = await Progress.findOne({ student: studentId, course: courseId });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found for this student and course' });
        }

        return res.status(200).json({ message: 'Progress fetched successfully', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course progress', error: error.message });
    }
};
