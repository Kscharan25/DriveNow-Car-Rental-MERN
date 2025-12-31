import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import Framer Motion

const MyBookings = () => {
    const { axios, user, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);

    const fetchMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user');
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyBookings();
        }
    }, [user]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto"
        >
            {/* Header Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Title title='My Bookings'
                    subTitle='View and manage your all car bookings'
                    align='left' />
            </motion.div>

            <div className="pb-20">
                <AnimatePresence mode="popLayout">
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <motion.div 
                                layout
                                key={booking._id} 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: index * 0.1 // ✅ Staggered appearance
                                }}
                                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                
                                {/* Car Image + Info */}
                                <div className="md:col-span-1">
                                    <div className="rounded-md overflow-hidden mb-3">
                                        <img src={booking.car?.image} alt="" className="w-full h-auto aspect-video object-cover" />
                                    </div>
                                    <p className="text-lg font-medium mt-2">{booking.car?.brand} {booking.car?.model}</p>
                                    <p className="text-gray-500">{booking.car?.year} • {booking.car?.category} • {booking.car?.location}</p>
                                </div>

                                {/* Booking Info */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <p className="px-3 py-1.5 bg-light rounded text-gray-600 font-medium">Booking #{index + 1}</p>
                                        
                                        <motion.p 
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                                booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                                                'bg-red-100 text-red-600'
                                            }`}
                                        >
                                            {booking.status}
                                        </motion.p>
                                    </div>

                                    <div className="flex items-start gap-2 mt-4">
                                        <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-xs">Rental Period</p>
                                            <p className="font-medium text-gray-700">
                                                {new Date(booking.pickupDate).toLocaleDateString()} To {new Date(booking.returnDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 mt-3">
                                        <img src={assets.location_icon_colored} alt="" className="w-4 h-4 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-xs">Pick-up Location</p>
                                            <p className="font-medium text-gray-700">{booking.car?.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="md:col-span-1 flex flex-col justify-between text-right border-l border-borderColor pl-6 max-md:border-l-0 max-md:pl-0 max-md:text-left">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (index * 0.1) + 0.3 }}
                                    >
                                        <p className="text-gray-400">Total Price</p>
                                        <h1 className="text-2xl font-bold text-primary">{currency}{booking.price}</h1>
                                    </motion.div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 border border-dashed border-borderColor rounded-lg mt-12"
                        >
                            <p className="text-gray-400">You haven't made any bookings yet.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default MyBookings;