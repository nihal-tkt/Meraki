import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
    const { id } = useParams();  // Getting course ID from the URL
    const navigate = useNavigate();

    const [course, setCourse] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
    });
    const [thumbnail, setThumbnail] = useState(null); // State for thumbnail
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the course details by ID to pre-populate the form
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/course/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourse(data.course);
                } else {
                    const data = await response.json();
                    setError(data.message || 'Error fetching course details');
                }
            } catch (error) {
                setError('An error occurred while fetching course details');
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: value,
        }));
    };

    // Handle thumbnail file selection
    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]); // Set the selected file
    };


    // Handle form submission to update course
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', course.title);
        formData.append('description', course.description);
        formData.append('price', course.price);
        formData.append('category', course.category);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail); // Add thumbnail to form data
        }



        try {
            const response = await fetch(`http://localhost:5000/api/v1/course/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert('Course updated successfully!');
                navigate(`/course/${id}`);  // Redirect to the course detail page
            } else {
                setError(data.message || 'Error updating course');
            }
        } catch (error) {
            setError('An error occurred while updating the course');
            console.error('Error updating course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">Edit Course</h2>

            {error && <div className="text-red-500">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Title */}
                <div>
                    <label htmlFor="title" className="block font-semibold">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Course Description */}
                <div>
                    <label htmlFor="description" className="block font-semibold">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Course Price */}
                <div>
                    <label htmlFor="price" className="block font-semibold">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={course.price}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Course Category */}
                <div>
                    <label htmlFor="category" className="block font-semibold">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={course.category}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Course Thumbnail */}
                <div>
                    <label htmlFor="thumbnail" className="block font-semibold">Thumbnail</label>
                    <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;
