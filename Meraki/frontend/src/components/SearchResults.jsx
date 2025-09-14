import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SearchResults = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');

                const response = await fetch(
                    `http://localhost:5000/api/v1/course/search?query=${encodeURIComponent(query)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // Include the token
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setCourses(data.courses);
                } else {
                    setError(data.message || 'Error fetching search results');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const totalPages = Math.ceil(courses.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedCourses = courses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">
                {courses.length > 0 ? 'Here are some courses' : 'No courses found'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                    <div
                        key={course._id}
                        className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                        )}
                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                        <p className="text-gray-700 mb-4">
                            {course.description.length > 100
                                ? course.description.slice(0, 100) + '...'
                                : course.description}
                        </p>
                        <p className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm mb-2">
                            {course.category}
                        </p>
                        <p className="text-sm text-gray-600">
                            Created by: <span className="font-semibold">{course.instructor?.fullName || 'Unknown'}</span>
                        </p>
                        <Link
                            to={`/courses/${course._id}`}
                            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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

export default SearchResults;
