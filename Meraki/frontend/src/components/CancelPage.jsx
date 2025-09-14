// frontend/src/components/CancelPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Payment Canceled</h1>
            <p>Your payment was not completed. Please try again.</p>
            <button onClick={() => navigate('/cart')}>Back to Cart</button>
        </div>
    );
};

export default CancelPage;
