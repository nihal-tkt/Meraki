import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    amountPaid: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    paymentId: { type: String }, // Store Stripe payment ID here
}, { timestamps: true });

export const Order = mongoose.model('Order',orderSchema);
