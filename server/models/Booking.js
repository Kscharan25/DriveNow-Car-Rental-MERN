import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car: { type: ObjectId, ref: "Car", required: true },
    // CHANGED: required to false so guests can book
    user: { type: ObjectId, ref: "User", required: false }, 
    owner: { type: ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ["pending", "cancelled", "confirmed"], 
        default: "pending" 
    },
    price: { type: Number, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;