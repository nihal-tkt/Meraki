import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
    const { courseId } = useParams(); // Extract courseId from the URL params
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5000/api/v1/course/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data.course);
                if (response.ok) {
                    setCourse(data.course);
                } else {
                    setError(data.message || 'Error fetching course details');
                }
            } catch (err) {
                setError('Something went wrong while fetching course details');
            } finally {
                setLoading(false); // Set loading to false after data is fetched or error occurs
            }
        };

        const fetchCourseReviews = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5000/api/v1/reviews/${courseId}`, {
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

        // Fetch both course details and reviews
        fetchCourseDetails();
        fetchCourseReviews();
    }, [courseId]);

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


    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        
            // Step 1: Fetch the user's enrolled courses
            const enrolledCoursesResponse = await fetch(`http://localhost:5000/api/v1/user/enrolled-courses`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const enrolledCoursesData = await enrolledCoursesResponse.json();
            console.log(enrolledCoursesData);
    
            // Step 2: Check if the course is already enrolled
            const enrolledCourses = enrolledCoursesData.enrolledCourses || [];
            const isCourseEnrolled = enrolledCourses.some(course => course._id === courseId);
    
            if (isCourseEnrolled) {
                // Course is already enrolled, show alert
                alert("You are already enrolled in this course!");
                return;  // Prevent further action
            }
    
            // Step 3: Fetch current cart items to check if course is already added
            const cartResponse = await fetch('http://localhost:5000/api/v1/cart', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const cartData = await cartResponse.json();
    
            // Step 4: Check if the course is already in the cart
            const isCourseInCart = cartData.items.some(item => item._id === courseId);
    
            if (isCourseInCart) {
                // Course is already in the cart, navigate to home
                alert("Course is already in your cart!");
                navigate('/home');
            } else {
                // Step 5: If the course is not in the cart, proceed with adding it
                const response = await fetch(`http://localhost:5000/api/v1/cart/add/${courseId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
                console.log(data);
    
                if (response.ok) {
                    setMessage(data.message); // Display success message
                    alert("Course added to cart!");
                    navigate("/home");
                } else {
                    setMessage(data.message); // Display error message
                }
            }
        } catch (err) {
            setMessage('Error adding course to cart');
            console.error(err);
        }
    };
    
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-8 bg-neutral-900 text-neutral-200 rounded-xl shadow-lg">
        {course ? (
          <>
            {course.thumbnail && (
              <div className="w-full h-64 mb-8 overflow-hidden rounded-lg shadow-lg bg-neutral-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <h2 className="text-4xl font-extrabold mb-6 tracking-wide text-white">{course.title}</h2>
            <p className="text-lg mb-6 text-neutral-400">{course.description}</p>
            
            <div className="bg-neutral-800 p-6 rounded-lg mb-8 shadow-md">
              <p className="text-md text-orange-400 mb-2">
                Category: <span className="font-semibold text-white">{course.category}</span>
              </p>
              <p className="text-md text-orange-400 mb-4">
                Price: <span className="font-semibold text-white">₹{course.price}</span>
              </p>
              <p className="text-md text-orange-400 mb-6">
                Instructor: <span className="font-semibold text-white">{course.instructor?.fullName || 'Unknown'}</span>
              </p>
      
              <button
                onClick={handleAddToCart}
                className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-800 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
      
            <div className="mt-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">
                Rating: {calculateAverageRating()} <span className="text-orange-400">&#9733;</span>
              </h3>
              <div className="flex mb-6 text-2xl">{renderStars(calculateAverageRating())}</div>
              
              <h3 className="text-xl font-semibold mb-4 text-neutral-300">Reviews</h3>
              {reviews.length > 0 ? (
                <>
                  {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => (
                    <div key={review._id} className="border-b border-neutral-800 mb-6 pb-4 flex items-start space-x-4 bg-neutral-800 p-4 rounded-lg shadow-md hover:bg-neutral-700 transition-colors">
                      {review.student?.profilePhoto && (
                        <img
                          src={review.student.profilePhoto}
                          alt={review.student.fullName}
                          className="w-14 h-14 rounded-full shadow-md"
                        />
                      )}
                      <div>
                        <p className="text-md font-semibold text-neutral-100">{review.student?.fullName}</p>
                        <div className="flex mb-1">{renderStars(review.rating)}</div>
                        <p className="text-neutral-400">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                  {reviews.length > 5 && !showAllReviews && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-orange-400 hover:underline transition-all"
                    >
                      View More
                    </button>
                  )}
                </>
              ) : (
                <p className="text-neutral-500">No reviews yet</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-neutral-500">Course not found</p>
        )}
      </div>

    );
};

export default CourseDetails;
