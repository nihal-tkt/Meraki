import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 9; // Display 9 courses per page

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:5000/api/v1/course', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setCourses(data.courses);
                    setTotalPages(Math.ceil(data.courses.length / itemsPerPage));
                } else {
                    console.error(data.message || 'Error fetching courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const getCurrentPageCourses = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return courses.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-zinc-900 text-orange-500 min-h-screen mt-20 p-8">
            <h2 className="text-4xl font-bold mb-8 text-white">All Courses</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getCurrentPageCourses().map((course) => (
                    <div
                        key={course._id}
                        className="bg-zinc-800 p-6 rounded-xl shadow-md hover:shadow-xl transform transition-transform hover:scale-105"
                    >
                        {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-white mb-3">{course.title}</h3>
                        <p className="text-gray-300 mb-4">
                            {course.description.slice(0, 100)}...
                        </p>
                        <p className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm mb-2">
                            {course.category}
                        </p>
                        <p className="text-sm text-gray-400">
                            Created by: <span className="font-semibold">{course.instructor?.fullName || 'Unknown'}</span>
                        </p>
                        <Link
                            to={`/courses/${course._id}`}
                            className="mt-4 inline-block w-full text-center bg-orange-500 text-zinc-900 py-2 rounded-full hover:bg-orange-600 transition"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-full ${
                                currentPage === i + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesList;
