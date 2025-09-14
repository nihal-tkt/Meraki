import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddReview = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0); // Star rating
    const [comment, setComment] = useState(''); // Comment field
    const [existingReview, setExistingReview] = useState(null); // Check if a review already exists
    const [isLoading, setIsLoading] = useState(true);

    // Fetch existing review if it exists
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(
                    `http://localhost:5000/api/v1/reviews/${courseId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                
                if (response.data.reviews) {
                    setExistingReview(response.data.reviews);
                    setRating(response.data.reviews[0].rating);
                    setComment(response.data.reviews[0].comment);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching review:', error);
                setIsLoading(false);
            }
        };

        fetchReview();
        
    }, [courseId]);

    // Handle star click for rating
    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    // Submit review (add or edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            if (existingReview) {
                // Update review
                await axios.put(
                    `http://localhost:5000/api/v1/reviews/${courseId}/${existingReview[0]._id}`,
                    { rating, comment },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Add new review
                await axios.post(
                    `http://localhost:5000/api/v1/reviews/${courseId}`,
                    { rating, comment },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
            navigate(`/mycourse/${courseId}`);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // Delete review
    const handleDelete = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(
                `http://localhost:5000/api/v1/reviews/${courseId}/${existingReview[0]._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setRating(0);
            setComment('');
            setExistingReview(null);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
            <h1 className="text-xl font-bold mb-4 text-black">
                {existingReview ? 'Edit Review' : 'Add Review'}
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <span
                                key={index}
                                className={`cursor-pointer text-3xl ${
                                    index < rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                                onClick={() => handleStarClick(index)}
                            >
                                ★
                            </span>
                        ))}
                </div>
                <textarea
                    className="w-full p-2 border rounded mb-4 text-black"
                    placeholder="Add your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {existingReview ? 'Edit Review' : 'Add Review'}
                    </button>
                    {existingReview && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete Review
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddReview;
