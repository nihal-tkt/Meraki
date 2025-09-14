import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MyAssignmentsInstructor = () => {
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmissions, setShowSubmissions] = useState({}); // To toggle submissions dropdown

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

    const handleDelete = async (assignmentId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/v1/assignment/${assignmentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            if (response.status === 200) {
                setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
            }
        } catch (err) {
            setError('Failed to delete assignment.');
            console.error(err);
        }
    };

    const handleUpdate = async (assignmentId) => {
        const assignment = assignments.find((a) => a._id === assignmentId);
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const toggleSubmissions = async (assignmentId, courseId) => {
        if (!showSubmissions[assignmentId]) {
            try {
                // Fetch enrolled students for the course
                const response = await axios.get(`http://localhost:5000/api/v1/course/${courseId}/enrolled-students`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
    
                // Update the state with fetched students
                setEnrolledStudents((prev) => ({
                    ...prev,
                    [assignmentId]: response.data.students, // Assuming API returns `students`
                }));
            } catch (error) {
                console.error('Error fetching enrolled students:', error);
            }
        }
        setShowSubmissions((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };

    const getSubmissionStatus = (assignment, studentId) => {
        const submission = assignment.submissions.find(
            (submission) => submission.student === studentId
        );

        if (!submission) {
            return { status: 'Not submitted', className: 'text-red-500' };
        }

        const isLate = new Date(submission.submittedAt) > new Date(assignment.dueDate);
        const submissionTime = new Date(submission.submittedAt).toLocaleString();

        return {
            status: `Submitted ${isLate ? 'late' : 'on time'} at ${submissionTime}`,
            className: isLate ? 'text-orange-500' : 'text-green-500',
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
                            View Assignment
                        </a>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => handleUpdate(assignment._id)}
                                className="bg-yellow-500 text-white p-2 rounded"
                            >
                                Update Assignment
                            </button>
                            <button
                                onClick={() => handleDelete(assignment._id)}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Delete Assignment
                            </button>
                        </div>
                        
                        <button
                            onClick={() => toggleSubmissions(assignment._id, courseId)}
                            className="mt-4 bg-blue-500 text-white p-2 rounded"
                        >
                            {showSubmissions[assignment._id] ? 'Hide Submissions' : 'Show Submissions'}
                        </button>
                        {showSubmissions[assignment._id] && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="font-semibold">Submissions:</h4>
                                {enrolledStudents[assignment._id] ? (
                                    enrolledStudents[assignment._id].sort((a, b) => a.fullName.localeCompare(b.fullName)).map((student) => {
                                        const status = getSubmissionStatus(assignment, student._id);
                                        return (
                                            <div key={student._id} className="flex justify-between">
                                                <span>{student.fullName}</span>
                                                <span className={status.className}>{status.status}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Loading enrolled students...</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
            {isModalOpen && selectedAssignment && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4 text-black">Update Assignment</h3>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const formData = new FormData();
                                    formData.append("title", selectedAssignment.title);
                                    formData.append("description", selectedAssignment.description);
                                    formData.append("dueDate", selectedAssignment.dueDate);
                                    if (selectedAssignment.file) {
                                        formData.append("file", selectedAssignment.file);
                                    }
                                    const response = await axios.put(
                                        `http://localhost:5000/api/v1/assignment/${selectedAssignment._id}`,
                                        formData,
                                        {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                                                "Content-Type": "multipart/form-data",
                                            },
                                        }
                                    );
                                    if (response.status === 200) {
                                        // Update the assignment list

                                        setAssignments((prev) =>
                                            prev.map((a) =>
                                                a._id === selectedAssignment._id ? response.data.assignment : a
                                            )
                                        );
                                        setIsModalOpen(false);
                                        alert("Assignment updated successfully!")
                                    }
                                } catch (err) {
                                    console.error('Failed to update assignment:', err);
                                }
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black">Title</label>
                                <input
                                    type="text"
                                    value={selectedAssignment.title}
                                    onChange={(e) =>
                                        setSelectedAssignment((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded px-3 py-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black">Description</label>
                                <textarea
                                    value={selectedAssignment.description}
                                    onChange={(e) =>
                                        setSelectedAssignment((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded px-3 py-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black">Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={new Date(selectedAssignment.dueDate).toISOString().slice(0, -1)}
                                    onChange={(e) =>
                                        setSelectedAssignment((prev) => ({
                                            ...prev,
                                            dueDate: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded px-3 py-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black">File</label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedAssignment((prev) => ({
                                            ...prev,
                                            file: e.target.files[0], // Update the file in state
                                        }))
                                    }
                                    className="w-full border rounded px-3 py-2 text-black"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyAssignmentsInstructor;
