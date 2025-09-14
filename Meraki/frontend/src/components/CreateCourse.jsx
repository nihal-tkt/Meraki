import React, { useState } from 'react';
import axios from 'axios';

const CreateCourse = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]); // Save the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('authToken'); // Assuming you use a token stored in localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token for authentication
                },
            };

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            if (thumbnail) {
                formDataToSend.append('thumbnail', thumbnail); // Append the file
            }

            const response = await axios.post(
                'http://localhost:5000/api/v1/course/create',
                formDataToSend,
                config
            );

            setSuccessMessage(response.data.message);
            setFormData({ title: '', description: '', category: '', price: '' }); // Reset the form
            setThumbnail(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="w-full max-w-lg bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-white font-bold text-lg text-center">Create Course</h2>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="text-white" htmlFor="title">Course Title</label>
                        <input
                            id="title"
                            placeholder="Enter course title"
                            className="w-full bg-gray-700 rounded-md border-gray-600 text-white px-3 py-2"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-white" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter course description"
                            className="w-full bg-gray-700 rounded-md border-gray-600 text-white px-3 py-2"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <label className="text-white" htmlFor="category">Category</label>
                        <input
                            id="category"
                            placeholder="Enter course category"
                            className="w-full bg-gray-700 rounded-md border-gray-600 text-white px-3 py-2"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-white" htmlFor="price">Price (in INR)</label>
                        <input
                            id="price"
                            placeholder="Enter course price"
                            className="w-full bg-gray-700 rounded-md border-gray-600 text-white px-3 py-2"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-white" htmlFor="thumbnail">Thumbnail</label>
                        <input
                            id="thumbnail"
                            placeholder="Upload course thumbnail"
                            className="w-full bg-gray-700 rounded-md border-gray-600 text-white px-3 py-2"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition-all duration-200"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;