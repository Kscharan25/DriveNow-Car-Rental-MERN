import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import fs from 'fs'; 
import path from 'path'; 
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js'; 
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// Database Connection
connectDB();

// Auto-create uploads folder
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Middleware
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "http://localhost:5174", 
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    process.env.FRONTEND_URL // Support for production frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// --- STATIC FILES ---
// This allows the frontend to access images stored in the uploads folder
app.use('/uploads', express.static('uploads'));

// --- ROUTES ---
app.get('/', (req, res) => res.send('API Working'));

// Check your controller: if getCars is in userRouter, this is correct.
// If getCars is in ownerRouter, the frontend should call /api/owner/cars.
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter); 
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));