# DriveNow - Car Rental Platform

DriveNow is a full-stack, modern car rental platform built with the MERN stack. It offers a seamless experience for users to browse, search, and book premium vehicles, while providing an intuitive dashboard for administrators to manage the fleet and bookings.

## Features

### For Users
- **Browse & Search:** Easily search for cars by brand, model, and filter by transmission type.
- **Availability Checking:** Check car availability for specific pickup and return dates before booking.
- **Detailed Listings:** View comprehensive details about each vehicle including category, seating capacity, fuel type, and price per day.
- **Booking System:** Seamlessly book a car for a specified duration.
- **My Bookings Dashboard:** Track current and past bookings.

### For Administrators (Owners)
- **Fleet Management:** Add, edit, or remove vehicles from the platform.
- **Booking Management:** View and manage user bookings in real-time.
- **Image Uploads:** Securely upload vehicle images via ImageKit integration.

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (for styling)
- **Framer Motion** (for animations)
- **React Router Dom** (for client-side routing)
- **Axios** (for API calls)

### Backend
- **Node.js & Express.js**
- **MongoDB** with **Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt** (Password Hashing)
- **ImageKit** (Image storage)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB server)
- ImageKit account

### Environment Variables

You need to set up environment variables for both the client and server. 
Refer to `.env.example` in both directories.

**Server (`server/.env`):**
```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_jwt_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**Client (`client/.env`):**
```env
VITE_CURRENCY=$
VITE_BASE_URL=http://localhost:4000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DriveNow-Car-Rental-MERN
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the Application Locally**
   
   Start the backend server:
   ```bash
   cd server
   npm run server
   ```
   
   Start the frontend application:
   ```bash
   cd client
   npm run dev
   ```

## Demo Credentials

If the database is configured with demo data, you can use the following credentials:

**Admin Account:**
- Email: `admin@drivenow.com`
- Password: `Admin@123!`

**User Account:**
- Email: `user@drivenow.com`
- Password: `User@123!`

To generate these demo credentials automatically in your production database, run:
```bash
cd server
node scripts/seedDemo.js
```

## Deployment

### Frontend (Vercel / Netlify)
The frontend is pre-configured for Vercel deployment with client-side routing.
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `client`.
3. Set the Framework Preset to Vite.
4. Add `VITE_BASE_URL` pointing to your deployed backend.

### Backend (Render / Heroku)
1. Deploy the `server` folder to your preferred Node.js hosting provider.
2. Set all the environment variables listed in the `server/.env.example`.
3. Ensure CORS allowed origins in `server.js` include your production frontend URL.

## Screenshots

*[Placeholder for Home Page Screenshot]*
*[Placeholder for Cars Listing Screenshot]*
*[Placeholder for Car Details Screenshot]*
*[Placeholder for Admin Dashboard Screenshot]*

---
Developed by [Your Name/Handle].
