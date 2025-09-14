import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CourseDetail = () => {
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { id } = useParams();  // Getting course ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the course details by ID
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
                    setCourse(data.course); // Set the course details
                } else {
                    const data = await response.json();
                    setError(data.message || 'Error fetching course details');
                }
            } catch (error) {
                setError('An error occurred while fetching course details');
                console.error('Error fetching course details:', error);
            }
        };

        const fetchCourseReviews = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5000/api/v1/reviews/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setReviews(data.reviews);
                } else {
                    setError(data.message || 'Error fetching reviews');
                }
            } catch (err) {
                setError('Something went wrong while fetching reviews');
            }
        };


        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/chat/${id}/unread-message`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.length); // Number of unread messages
                } else {
                    console.error('Failed to fetch unread messages count');
                }
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            }
        };

        fetchCourseDetails();
        fetchCourseReviews();
        fetchUnreadCount();
    }, [id]);

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="text-yellow-500">&#9733;</span>); // Full star
            } else if (i - rating < 1) {
                stars.push(<span key={i} className="text-yellow-500">&#9734;</span>); // Half star
            } else {
                stars.push(<span key={i} className="text-gray-400">&#9734;</span>); // Empty star
            }
        }
        return stars;
    };

    // Handle delete course
    const handleDeleteCourse = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this course?');
        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/course/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    alert('Course deleted successfully');
                    navigate('/created-course');  // Redirect to created courses page
                } else {
                    const data = await response.json();
                    alert(data.message || 'Error deleting course');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('An error occurred while deleting the course');
            }
        }
    };

    // Handle edit course
    const handleEditCourse = () => {
        navigate(`/edit-course/${id}`);  // Navigate to edit course page
    };

    // Handle add video
    const handleAddLecture = () => {
        navigate(`/add-lecture/${id}`);  // Navigate to add video page
    };

    // Handle add assignment
    const handleAddAssignment = () => {
        navigate(`/add-assignment/${id}`);  // Navigate to add assignment page
    };

    // Handle view enrolled students
    const handleEnrolledStudents = () => {
        navigate(`/enrolled-students/${id}`);  // Navigate to enrolled students page
    };

    const handleChatNavigation = () => {
        const targetRoute = unreadCount > 0 ? `/unread-messages/${id}` : `/all-chats/${id}`;
        navigate(targetRoute);
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-black text-white">
    <h2 className="text-4xl font-extrabold mb-6 text-orange-500">{course.title}</h2>

    <div className="flex space-x-6 mb-6">
        {/* Buttons section */}
        <div className="flex flex-col space-y-4">
            <button
                onClick={handleDeleteCourse}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
            >
                Delete Course
            </button>
            <button
                onClick={handleEditCourse}
                className="py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-800 transition"
            >
                Edit Course
            </button>
            <button
                onClick={handleAddLecture}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-800 transition"
            >
                Add Lecture
            </button>
            <button
                onClick={handleAddAssignment}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
            >
                Add Assignment
            </button>
            <button
                onClick={handleEnrolledStudents}
                className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800 transition"
            >
                Enrolled Students
            </button>
        </div>

        {/* Course details section */}
        <div className="flex-1 p-4 bg-gray-800 rounded-lg shadow-lg">
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Description</h3>
                <p className="text-gray-300">{course.description}</p>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Category</h3>
                <p className="text-gray-300">{course.category}</p>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Price</h3>
                <p className="text-gray-300">₹{course.price}</p>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Created By</h3>
                <p className="text-gray-300">{course.instructor.fullName}</p>
            </div>
        </div>
    </div>

    {/* Floating Orange Button */}
    <div className="fixed bottom-4 right-4">
        <button
            onClick={handleChatNavigation}
            className="bg-orange-500 text-black py-2 px-4 rounded-full shadow-lg hover:bg-orange-700"
        >
            {unreadCount > 0 ? `Unread Messages (${unreadCount})` : 'Messages'}
        </button>
    </div>

    <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 py-2">
            Rating: {calculateAverageRating()} <span>&#9733;</span>
        </h3>
        <div className="flex mb-4 text-2xl">{renderStars(calculateAverageRating())}</div>
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviews.length > 0 ? (
            <>
                {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => (
                    <div key={review._id} className="border-b border-gray-700 mb-4 pb-4 flex items-center">
                        {review.student?.profilePhoto && (
                            <img
                                src={review.student.profilePhoto}
                                alt={review.student.fullName}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                        )}

                        <div>
                            <p className="text-sm font-semibold">{review.student?.fullName}</p>
                            <div className="flex">{renderStars(review.rating)}</div>
                            <p className="text-gray-400">{review.comment}</p>
                        </div>
                    </div>
                ))}
                {reviews.length > 5 && !showAllReviews && (
                    <button
                        onClick={() => setShowAllReviews(true)}
                        className="text-orange-400 hover:underline"
                    >
                        View More
                    </button>
                )}
            </>
        ) : (
            <p>No reviews yet</p>
        )}
    </div>
    <Link
        to={`/assignment/${id}`}
        className="fixed bottom-6 left-6 bg-purple-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-800 transition duration-200"
    >
        View Assignments
    </Link>
</div>


    );
};

export default CourseDetail;
