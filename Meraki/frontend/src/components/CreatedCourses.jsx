import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the created courses from the backend
        const fetchCreatedCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/user/created-courses', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.createdCourses); // Assuming the response contains 'createdCourses'
                } else {
                    const data = await response.json();
                    setError(data.message || 'Error fetching courses');
                }
            } catch (error) {
                setError('An error occurred while fetching courses');
                console.error('Error fetching courses:', error);
            }
        };

        fetchCreatedCourses();
    }, []);

    const truncateDescription = (description, length = 100) => {
        if (description.length > length) {
            return description.substring(0, length) + '...';
        }
        return description;
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">My Created Courses</h2>
            
            {/* Display error message if exists */}
            {error && <div className="text-red-500">{error}</div>}

            {/* Display all the courses in a card format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <p>No courses found</p>
                ) : (
                    courses.map((course) => (
                        <div key={course._id} className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition">
                            {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                        )}
                            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                            <p className="text-gray-700 mb-4">{truncateDescription(course.description)}</p>

                            {/* Category with grey background */}
                            <div className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm mb-2">
                                {course.category}
                            </div>

                            {/* Price */}
                            <div className="mt-3 font-semibold text-gray-200 text-lg">{`₹${course.price}`}</div>

                            {/* View more button (optional) */}
                            <button
                                onClick={() => navigate(`/course/${course._id}`)}
                                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CreatedCourses;
