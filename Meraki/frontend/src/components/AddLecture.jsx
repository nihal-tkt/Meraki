import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddLecture = () => {
    const { courseId } = useParams(); // Extract courseId from the URL
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Update file state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !file) {
            setError('Please fill all fields and upload a file');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('lecture', file);

            const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

            const response = await fetch(`http://localhost:5000/api/v1/lecture/${courseId}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // Send the form data
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                alert('Lecture added successfully!');
                navigate(`/course/${courseId}`); // Navigate back to the course details page
            } else {
                setError(data.message || 'Failed to add lecture');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while adding the lecture');
        }
    };

    
                <div>
                    <label htmlFor="file" className="block text-sm font-medium mb-1">
                        Upload File
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="w-full border rounded px-3 py-2"
                        accept="video/*,image/*,.pdf"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddLecture;
