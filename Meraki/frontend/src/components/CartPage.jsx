import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QJgARE3PErr7tLYOvI654XExVXDS4xhBCjpc8gxyOepMww5FRezApT0Xw7GIZ0Z0MgyAZXQiyiqXQNch51a4MUm002DLbqDRP');

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('User is not authenticated');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/v1/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const cart = response.data || {};
                setCartItems(cart.items || []);
                setTotalAmount(cart.totalAmount || 0);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const handleRemoveCourse = async (courseId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('User is not authenticated');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/api/v1/cart/remove/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems(cartItems.filter(item => item._id !== courseId));
            setTotalAmount(totalAmount - response.data.removedCoursePrice);
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };

    const handleProceedToPay = async () => {
        if (cartItems.length === 0 || totalAmount <= 0) {
            alert('Your cart is empty. Please add items before proceeding to payment.');
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is missing');
            navigate('/login');
            return;
        }

        setIsLoading(true);

        try {
            const cartItemsData = cartItems.map(item => ({
                _id: item._id,
                title: item.title,
                description: item.description,
                price: item.price,
            }));

            const { data } = await axios.post('http://localhost:5000/api/v1/payment/create-checkout-session', {
                cartItems: cartItemsData,
                totalAmount,
                userId,
            });

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

            if (error) {
                console.error('Error redirecting to Stripe Checkout:', error);
            }
        } catch (error) {
            console.error('Error initiating payment process:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const takeMeHome = () => {
        navigate('/home');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-300">
            <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-white">Your Cart</h1>

                {isLoading ? (
                    <div className="text-center">
                        <p className="text-gray-400">Processing payment, please wait...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center text-gray-400">
                        <h2 className="text-xl font-semibold">Your cart is empty!</h2>
                        <p>Add something and come back.</p>
                        <button
                            onClick={takeMeHome}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Home
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems.map(course => (
                                <div key={course._id} className="p-4 bg-gray-700 rounded-lg shadow flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{course.title}</h2>
                                        <p className="text-sm text-gray-400">
                                            {course.description.length > 100
                                                ? `${course.description.substring(0, 100)}...`
                                                : course.description}
                                        </p>
                                        <p className="text-sm text-gray-400">Instructor: {course.instructor.fullName}</p>
                                        <p className="text-lg font-bold text-white">₹{course.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveCourse(course._id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-gray-700 rounded-lg shadow text-center">
                            <h2 className="text-lg font-bold text-white">Total Amount: ₹{totalAmount}</h2>
                            <button
                                onClick={handleProceedToPay}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;