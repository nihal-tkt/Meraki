import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Order } from '../models/orderSchema.js';
import { Cart } from '../models/cartSchema.js';
import { User } from '../models/userSchema.js';
import { Course } from '../models/courseSchema.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret); // Verify webhook signature
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received Stripe event:', event.type);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const orderId = session.client_reference_id; // Order ID
        const userId = session.metadata.userId; // User ID from metadata
        const purchasedCourseIds = session.metadata.courseIds.split(','); // Course IDs from metadata

        try {
            // 1. Update the order status to 'completed'
            const order = await Order.findByIdAndUpdate(
                orderId,
                { status: 'completed' },
                { new: true }
            );

            if (!order) {
                console.error(`Order ${orderId} not found.`);
                return res.status(404).json({ message: 'Order not found' });
            }
            console.log(`Order ${orderId} marked as completed.`);

            // 2. Clear the user's cart
            const cart = await Cart.findOneAndDelete({ student: userId });
            if (cart) {
                console.log(`Cart cleared for user: ${userId}`);
            }

            // 3. Update user's enrolled courses (avoid duplicates)
            const user = await User.findById(userId);
            if (!user) {
                console.error(`User ${userId} not found.`);
                return res.status(404).json({ message: 'User not found' });
            }

            const newCourses = purchasedCourseIds.filter(
                (courseId) => !user.enrolledCourses.includes(courseId)
            );

            if (newCourses.length > 0) {
                user.enrolledCourses.push(...newCourses);
                await user.save();
                console.log(`Enrolled courses updated for user: ${userId}`);

                // 4. Update enrolledStudents in each course
                await Promise.all(
                    newCourses.map(async (courseId) => {
                        await Course.findByIdAndUpdate(
                            courseId,
                            { $addToSet: { enrolledStudents: userId } },
                            { new: true }
                        );
                    })
                );
                console.log(`Enrolled students updated for courses: ${newCourses}`);
            }

            res.status(200).json({ received: true });
        } catch (err) {
            console.error('Error processing webhook event:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
        res.status(200).json({ received: true });
    }
};
