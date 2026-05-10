import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Internal Helper: Checks if a car is busy during a specific range.
const checkAvailabilityInternal = async (carId, pickupDate, returnDate) => {
    const sDate = new Date(pickupDate);
    sDate.setHours(0, 0, 0, 0);

    const rDate = new Date(returnDate);
    rDate.setHours(23, 59, 59, 999);

    const overlappingBookings = await Booking.find({
        car: carId,
        status: { $ne: 'cancelled' }, 
        pickupDate: { $lte: rDate },
        returnDate: { $gte: sDate }
    });

    return overlappingBookings.length === 0;
}

// API: Create a New Booking
export const createBooking = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null; 
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailabilityInternal(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Sorry, this car was just booked." });
        }

        const carData = await Car.findById(car);
        if (!carData) return res.json({ success: false, message: "Car not found" });

        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        const diffTime = Math.abs(end - start);
        const noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 

        const newBooking = await Booking.create({ 
            car, 
            owner: carData.owner, 
            user: userId, 
            pickupDate: start, 
            returnDate: end, 
            price: carData.pricePerDay * noOfDays
        });

        res.json({ success: true, message: "Booking Created Successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: Get User Bookings (CRITICAL: Added .populate('car'))
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        // This 'populate' is what makes the car details show up in React
        const bookings = await Booking.find({ user: userId })
            .populate('car') 
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: Get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const bookings = await Booking.find({ owner: ownerId })
            .populate('car')
            .populate('user', 'name email');
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: Change Status
export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        await Booking.findByIdAndUpdate(bookingId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// FIX: This is the missing export that caused your crash
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;
        const isAvailable = await checkAvailabilityInternal(carId, pickupDate, returnDate);
        res.json({ success: true, available: isAvailable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}