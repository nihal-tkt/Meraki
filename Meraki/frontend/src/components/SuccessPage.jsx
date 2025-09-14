import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Thank you for your purchase!</p>
            <button onClick={() => navigate('/home')}>Go to Home</button>
        </div>
    );
};

export default SuccessPage;
