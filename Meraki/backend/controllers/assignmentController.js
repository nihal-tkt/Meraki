import { Assignment } from "../models/assignmentSchema.js";
import { Course } from "../models/courseSchema.js";
import cloudinary from "../utils/cloudinary.js";

export const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, dueDate } = req.body;

    try {

        // Verify if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        let submissionLink = null;

        // Handle file upload to Cloudinary
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'media',
                resource_type: 'auto', // Supports all file types
            });
            submissionLink = uploadResult.secure_url;
        }

        const newAssignment = await Assignment.create({
            course: courseId,
            title,
            description,
            dueDate,
            submissionLink,
        });

        // Optionally update the course document to include this assignment
        await Course.findByIdAndUpdate(courseId, { $push: { assignments: newAssignment._id } });

        res.status(201).json({ message: "Assignment created successfully", newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Error creating assignment", error: error.message });
    }
};

export const getAssignmentsByCourse = async (req, res) => {
    const { courseId } = req.params; // Extract courseId from URL parameters

    try {
        // Find the course to ensure it exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch assignments related to the course
        const assignments = await Assignment.find({ course: courseId }).select('title description dueDate submissionLink submissions');

        res.status(200).json({ assignments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
};

export const submitAssignment = async (req, res) => {
    const { courseId, assignmentId } = req.params; // Extract courseId and assignmentId from URL parameters
    const studentId = req.user.id;

    try {
        // Find the course to ensure it exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the assignment to ensure it exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        let submissionLink = null;

        // Handle file upload to Cloudinary
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'media',
                resource_type: 'auto', // Supports all file types
            });
            submissionLink = uploadResult.secure_url;
        }

        const existingSubmission = assignment.submissions.find(submission => submission.student.toString() === studentId);

        if (existingSubmission) {
            // If the student has already submitted, update the submission link and the submittedAt timestamp
            existingSubmission.link = submissionLink;
            existingSubmission.submittedAt = new Date(); // Update submission time

            await assignment.save();

            return res.status(200).json({ message: 'Assignment updated successfully', assignment });
        }

        // Update the assignment with the submission link (you may want to store student submissions separately)
        assignment.submissions.push({ student: studentId, link: submissionLink, submittedAt: new Date(),});
        await assignment.save();

        res.status(200).json({ message: 'Assignment submitted successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;

    try {
        // Find and delete the assignment
        const assignment = await Assignment.findByIdAndDelete(assignmentId);

        // Check if the assignment exists
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Optionally, you can also update the course to remove this assignment reference if needed
        const course = await Course.findById(assignment.course);
        course.assignments.pull(assignmentId);
        await course.save();

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error: error.message });
    }
};

export const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body; // Capture the fields to update from the request body
    let submissionLink = null;

    try {
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'media',
                resource_type: 'auto', // Supports all file types
            });
            submissionLink = uploadResult.secure_url;

            // Add the uploaded file's URL to the updates object
            updates.submissionLink = submissionLink;
        }
        // Find the assignment by ID and update it with the provided fields
        const updatedAssignment = await Assignment.findByIdAndUpdate(assignmentId, updates, {
            new: true, // Return the updated document
            runValidators: true, // Ensure that validation is applied
        });

        // Check if the assignment exists
        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating assignment', error: error.message });
    }
};
