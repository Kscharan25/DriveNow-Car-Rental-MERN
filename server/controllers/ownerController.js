import User from "../models/user.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js"; 
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// --- API to update user image ---
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        if (!req.file) return res.json({ success: false, message: "No image provided" });

        const fileBuffer = fs.readFileSync(req.file.path);
        const base64Image = fileBuffer.toString('base64');

        // 1. Upload to ImageKit
        const response = await imagekit.files.upload({
            file: base64Image,
            fileName: `user_${_id}_${Date.now()}`,
            folder: 'user'
        });

        // 2. ✅ MANUAL URL CONSTRUCTION (Bypassing imagekit.url)
        const endpoint = process.env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, ""); 
        const path = response.filePath.replace(/^\//, "");
        
        // Applying transformation via query parameters (?tr=...)
        const optimizedImageUrl = `${endpoint}/${path}?tr=w-400,h-400,fo-auto,q-80`;

        await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });
        
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.json({ success: true, message: "Image updated", imageUrl: optimizedImageUrl });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Upload Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// --- Add Car ---
export const addCar = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== "owner") return res.json({ success: false, message: "Only owners can add cars" });
        if (!req.file) return res.json({ success: false, message: "Car image is required" });

        const carData = JSON.parse(req.body.carData);
        const fileBuffer = fs.readFileSync(req.file.path);
        const base64Image = fileBuffer.toString('base64');

        const uploadResponse = await imagekit.upload({
            file: base64Image, 
            fileName: `car_${Date.now()}`,
            folder: "car_rentals", // <--- This tells the API to put it in the cloud folder
        });

        // ✅ MANUAL URL CONSTRUCTION
        const endpoint = process.env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "");
        const path = uploadResponse.filePath.replace(/^\//, "");
        const carImageUrl = `${endpoint}/${path}`; 

        const newCar = await Car.create({
            ...carData,
            owner: _id,
            image: carImageUrl,
            fileId: uploadResponse.fileId
        });

        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.json({ success: true, message: "Car added successfully", car: newCar });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.json({ success: false, message: error.message });
    }
};

// --- Standard Controller Functions ---
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id }); 
        res.json({ success: true, cars });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const toggleCarAvailability = async (req, res) => {
    try {
        const { carId } = req.body;
        const car = await Car.findById(carId); 
        if (!car || car.owner.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }
        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({ success: true, message: "Availability Toggled" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);
        if (!car || car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }
        car.owner = null;
        car.isAvailable = false;
        await car.save();
        res.json({ success: true, message: "Car Removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });
        const pendingBookings = await Booking.countDocuments({ owner: _id, status: "pending" });
        const completedBookings = await Booking.countDocuments({ owner: _id, status: "confirmed" });
        const monthlyRevenue = bookings.filter(b => b.status === 'confirmed').reduce((a, b) => a + b.price, 0);

        res.json({ 
            success: true, 
            dashboardData: {
                totalCars: cars.length, totalBookings: bookings.length,
                pendingBookings, completedBookings,
                recentBookings: bookings.slice(0, 3), monthlyRevenue
            } 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};