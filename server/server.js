import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import fs from 'fs'; 
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

// Updated CORS: Added 5174 and 5175 to the whitelist
const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "http://localhost:5174", 
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://localhost:5176"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("Blocked by CORS: ", origin); // This helps you debug in the terminal
            return callback(new Error('CORS Policy Error'), false);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.get('/', (req, res) => res.send('API Working'));
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter); 
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));