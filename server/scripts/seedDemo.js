import mongoose from "mongoose";
import bcrypt from "bcrypt";
import 'dotenv/config';
import User from "../models/user.js";

const seedDemoCredentials = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("Error: MONGODB_URI is not set in environment variables.");
            process.exit(1);
        }

        console.log("Connecting to production database...");
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
        console.log("Database connected.");

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("Admin@123!", salt);
        const userPassword = await bcrypt.hash("User@123!", salt);

        console.log("Creating or updating Admin user...");
        await User.findOneAndUpdate(
            { email: "admin@drivenow.com" },
            { name: "Demo Admin", email: "admin@drivenow.com", password: adminPassword, role: "owner" },
            { upsert: true }
        );

        console.log("Creating or updating Standard User...");
        await User.findOneAndUpdate(
            { email: "user@drivenow.com" },
            { name: "Demo User", email: "user@drivenow.com", password: userPassword, role: "user" },
            { upsert: true }
        );

        console.log("Demo credentials configured successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error configuring demo credentials:", error);
        process.exit(1);
    }
};

seedDemoCredentials();
