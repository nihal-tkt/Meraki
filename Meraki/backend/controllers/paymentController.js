import Stripe from 'stripe';
import { Order } from '../models/orderSchema.js'; 
import { User } from '../models/userSchema.js';
import { Cart } from '../models/cartSchema.js';
import { Course } from '../models/courseSchema.js';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Use your Stripe Secret Key

// Controller to create a payment intent
export const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;  // Expecting the amount to be passed in the request body (in paise, e.g., 100 = ₹1)

    try {
        // Create a Payment Intent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,  // Convert to paise (Stripe expects amount in subunits like paise for INR)
            currency: 'inr',  // Currency
            payment_method_types: ['card'],  // Allow card payments
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,  // Send the client secret to the frontend
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Internal server error while creating payment intent' });
    }
};

export const createCheckoutSession = async (req, res) => {
    
    const { cartItems, totalAmount, userId } = req.body; // Get cart items, total amount, and studentId from frontend
    
    try {
        // Map cart items to line items in Stripe
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'inr', // Currency code (Indian Rupee in this case)
                product_data: {
                    name: item.title,
                    description: item.description,
                },
                unit_amount: item.price * 100, // Convert INR to paise (1 INR = 100 paise)
            },
            quantity: 1, // Quantity of each item
        }));

        // Create an order in the database
        const newOrder = new Order({
            student: userId,  // Link to the student who is making the purchase
            courses: cartItems.map(item => item._id).filter(id => id != null), // Save the course IDs in the order
            amountPaid: totalAmount, // Save the total amount paid
            status: 'pending',  // Initially set the status to 'pending'
        });

        // Save the order in the database
        const savedOrder = await newOrder.save();

        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Allow card payments
            line_items: lineItems, // Pass the line items (cart items)
            mode: 'payment', // For one-time payments
            success_url: `${process.env.CLIENT_URL}/success`, // Redirect on success
            cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect on cancellation
            client_reference_id: savedOrder._id.toString(),  // Store the order ID in the client_reference_id
            metadata: {
                userId: userId,
                courseIds: cartItems.map((item) => item._id).join(','), // Pass course IDs
            },
        });

        // Send the session ID and order details to the frontend
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const verifyPaymentStatus = async (req, res) => {
    const { sessionId } = req.body;
    console.log(req.body);

    try {
        // Fetch the session from Stripe using the sessionId
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        const userId = session.metadata.userId; // Retrieve user ID from metadata
        const purchasedCourseIds = session.metadata.courseIds.split(','); // Retrieve course IDs from metadata

        // Update the order status to 'completed' in the database
        const order = await Order.findByIdAndUpdate(
            session.client_reference_id, // Assuming order ID is in client_reference_id
            { status: 'completed' },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch and clear the user's cart
        const cart = await Cart.findOneAndDelete({ student: userId });
        if (cart) {
            console.log('Cart cleared for user:', userId);
        }

        // Update the user's enrolled courses, avoiding duplicates
        const newCourses = purchasedCourseIds.filter(
            (courseId) => !user.enrolledCourses.includes(courseId)
        );

        if (newCourses.length > 0) {
            user.enrolledCourses.push(...newCourses);
            await user.save();
            console.log('Enrolled courses updated for user:', userId);

            // Update the enrolledStudents field in each course
            await Promise.all(
                newCourses.map(async (courseId) => {
                    await Course.findByIdAndUpdate(
                        courseId,
                        { $addToSet: { enrolledStudents: userId } }, // Avoid duplicates
                        { new: true }
                    );
                })
            );
            console.log('Enrolled students updated in courses:', newCourses);
        }

        res.status(200).json({
            message: 'Payment verified successfully',
            order,
            enrolledCourses: user.enrolledCourses,
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
