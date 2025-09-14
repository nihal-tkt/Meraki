import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAssignment = () => {
    const { courseId } = useParams(); // Get the courseId from the URL
    const navigate = useNavigate(); // To navigate after success

    // State to manage form data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Prepare form data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dueDate', dueDate);
        formData.append('file', file);

        try {
            // Send the form data to the backend
            const response = await axios.post(
                `http://localhost:5000/api/v1/assignment/${courseId}/create`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming JWT token is stored in localStorage
                    },
                }
            );

            if (response.status === 201) {
                // Navigate back to the course page on success
                alert('Assignment added successfully!');
                navigate(`/course/${courseId}`);
            }
        } catch (err) {
            setError('Failed to create assignment. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Create Assignment</h2>

            {/* Error message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-black"
                    />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full border rounded px-3 py-2 text-black"
                    ></textarea>
                </div>

                {/* Due Date Input */}
                <div className="mb-4">
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                        type="datetime-local"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-black"
                    />
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <label htmlFor="file" className="block text-sm font-medium mb-1">Upload Assignment File</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        accept=".pdf,.docx,.txt,.jpeg,.jpg,.png"
                    />
                </div>

                {/* Submit Button */}
                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Create Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAssignment;
