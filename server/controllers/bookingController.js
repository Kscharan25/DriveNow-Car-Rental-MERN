import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import mongoose from "mongoose";

/**
 * Helper Function: Checks if a car is busy during a specific range.
 * Logic: (RequestedStart <= ExistingEnd) AND (RequestedEnd >= ExistingStart)
 */
const checkAvailabiltity = async (carId, pickupDate, returnDate) => {
    // 1. Normalize dates to avoid time-of-day gaps
    const sDate = new Date(pickupDate);
    sDate.setHours(0, 0, 0, 0);

    const rDate = new Date(returnDate);
    rDate.setHours(23, 59, 59, 999);

    // 2. Query for overlapping active bookings
    const overlappingBookings = await Booking.find({
        car: carId,
        status: { $ne: 'cancelled' }, 
        $or: [
            {
                pickupDate: { $lte: rDate },
                returnDate: { $gte: sDate }
            }
        ]
    });

    console.log(`Car ID: ${carId} | Conflicts: ${overlappingBookings.length}`);
    return overlappingBookings.length === 0;
}

// API: Check Availability for a specific location and date range
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // Fetch active cars in the requested location
        const cars = await Car.find({ location, isAvailable: true });

        // Run availability checks in parallel for better performance
        const availabilityCarsPromise = cars.map(async (car) => {
            const isAvailable = await checkAvailabiltity(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable };
        });

        const allCars = await Promise.all(availabilityCarsPromise);
        
        // Filter out cars that are already booked
        const availableCars = allCars.filter(car => car.isAvailable === true);

        res.json({ success: true, availableCars });

    } catch (error) {
        console.error("Availability Check Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: Create a New Booking
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user; // User ID from Auth middleware
        const { car, pickupDate, returnDate } = req.body;

        // 1. Normalize dates for strict blocking
        const start = new Date(pickupDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(returnDate);
        end.setHours(23, 59, 59, 999);

        // 2. Final verification to prevent race-condition bookings
        const isAvailable = await checkAvailabiltity(car, start, end);
        if (!isAvailable) {
            return res.json({ success: false, message: "Sorry, this car was just booked by someone else." });
        }

        const carData = await Car.findById(car);
        if (!carData) return res.json({ success: false, message: "Car not found" });

        // 3. Calculate price based on full days
        const diffTime = Math.abs(end - start);
        const noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 

        // 4. Create record with Date objects
        const newBooking = await Booking.create({ 
            car, 
            owner: carData.owner, 
            user: _id, 
            pickupDate: start, 
            returnDate: end, 
            price: carData.pricePerDay * noOfDays
        });

        res.json({ success: true, message: "Booking Created Successfully", booking: newBooking });

    } catch (error) {
        console.error("Create Booking Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: List Customer Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id })
            .populate("car")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: List Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('car user', '-password') 
            .sort({ createdAt: -1 });
            
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API: Update Booking Status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Not found" });

        if (booking.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();
        
        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}