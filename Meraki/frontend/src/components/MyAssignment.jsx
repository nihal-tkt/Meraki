import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MyAssignment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/v1/assignment/${courseId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
                // Sort assignments by dueDate (earliest first)
                const sortedAssignments = response.data.assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setAssignments(sortedAssignments);
            } catch (err) {
                setError('Failed to fetch assignments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourseName = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/v1/course/${courseId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
                setCourseName(response.data.course.title);
            } catch (err) {
                setError('Failed to fetch course details.');
                console.error(err);
            }
        };

        fetchAssignments();
        fetchCourseName();
    }, [courseId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e, assignmentId) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please choose a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Check if the student has already submitted the assignment
            const existingSubmission = assignments
                .find((assignment) => assignment._id === assignmentId)
                ?.submissions.find(
                    (submission) => submission.student === localStorage.getItem('userId')
                );

            let response;

            if (existingSubmission) {
                // If a submission exists, update the submission
                response = await axios.post(
                    `http://localhost:5000/api/v1/assignment/${courseId}/${assignmentId}/submit`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
            } else {
                // If no submission exists, create a new one
                response = await axios.post(
                    `http://localhost:5000/api/v1/assignment/${courseId}/${assignmentId}/submit`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
            }

            if (response.status === 200) {
                // Update the assignment state after submission or update
                const updatedAssignments = assignments.map((assignment) => {
                    if (assignment._id === assignmentId) {
                        const updatedSubmissions = existingSubmission
                            ? assignment.submissions.map((submission) =>
                                submission.student === localStorage.getItem('userId')
                                    ? {
                                        ...submission,
                                        link: response.data.link,
                                        submittedAt: new Date(),
                                    }
                                    : submission
                            )
                            : [
                                ...assignment.submissions,
                                {
                                    student: response.data.student,
                                    link: response.data.link,
                                    submittedAt: new Date(),
                                },
                            ];

                        return { ...assignment, submissions: updatedSubmissions };
                    }
                    return assignment;

                });

                setAssignments(updatedAssignments);
                window.location.reload();
            }
        } catch (err) {
            setError('Failed to submit assignment. Please try again.');
            console.error(err);
        }
    };

    const getSubmissionStatus = (assignment) => {
        const submission = assignment.submissions.find(
            (submission) => submission.student === localStorage.getItem('userId')
        );

        if (!submission) {
            return { status: 'Not submitted yet', className: 'text-red-500' };
        }

        const isLate = new Date(submission.submittedAt) > new Date(assignment.dueDate);
        const submissionTime = new Date(submission.submittedAt).toLocaleString();

        return {
            status: `Submitted ${isLate ? 'late' : 'before deadline'} at ${submissionTime}`,
            className: isLate ? 'text-red-500' : 'text-green-500',
        };
    };

    if (loading) return <p>Loading assignments...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold">Assignments for Course {courseName}</h2>
            {assignments.length === 0 ? (
                <p>No assignments available for this course.</p>
            ) : (
                assignments.map((assignment) => (
                    <div key={assignment._id} className="border p-4 mb-4">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{assignment.title}</h3>
                            <span className="text-sm">Due by: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <p>{assignment.description}</p>
                        <a
                            href={assignment.submissionLink}
                            className="text-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Assignment
                        </a>
                        <div className="mt-4">
                            <strong>Status: </strong>
                            <span className={getSubmissionStatus(assignment).className}>
                                {getSubmissionStatus(assignment).status}
                            </span>
                        </div>

                        {/* If the student has already submitted, show file upload form to allow updating */}
                        {assignment.submissions.some(
                            (submission) => submission.student === localStorage.getItem('userId')
                        ) && (
                                <form onSubmit={(e) => handleSubmit(e, assignment._id)} className="mt-4">
                                    <input type="file" onChange={handleFileChange} required className="border p-2" />
                                    <button
                                        type="submit"
                                        className="ml-4 bg-blue-500 text-white p-2 rounded"
                                    >
                                        Update Submission
                                    </button>
                                </form>
                            )}

                        {/* If not submitted, show file upload form */}
                        {!assignment.submissions.some(
                            (submission) => submission.student === localStorage.getItem('userId')
                        ) && (
                                <form onSubmit={(e) => handleSubmit(e, assignment._id)} className="mt-4">
                                    <input type="file" onChange={handleFileChange} required className="border p-2" />
                                    <button
                                        type="submit"
                                        className="ml-4 bg-blue-500 text-white p-2 rounded"
                                    >
                                        Submit Assignment
                                    </button>
                                </form>
                            )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyAssignment;
