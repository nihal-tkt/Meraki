import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

export const Cart = mongoose.model('Cart',cartSchema);
