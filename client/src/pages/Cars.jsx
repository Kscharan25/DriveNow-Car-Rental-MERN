import React, { useEffect, useState } from "react";
import Title from '../components/Title'
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion' // Use 'framer-motion' or 'motion/react'

const Cars = () => {
    const [searchParams] = useSearchParams();
    const pickupLocation = searchParams.get('pickupLocation');
    const pickupDate = searchParams.get('pickupDate'); 
    const returnDate = searchParams.get('returnDate');

    const { axios, cars } = useAppContext(); 

    const [input, setInput] = useState('');
    const [transmission, setTransmission] = useState('');
    const [filteredCars, setFilteredCars] = useState([]);
    
    const isSearchData = pickupLocation && pickupDate && returnDate;

    const searchCarAvailability = async () => {
        try {
            const { data } = await axios.post('/api/bookings/check-availability', { 
                location: pickupLocation, 
                pickupDate, 
                returnDate 
            });

            if (data.success) {
                setFilteredCars(data.availableCars);
                if (data.availableCars.length === 0) {
                    toast.error('No cars available for these dates');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching available cars");
        }
    }

    useEffect(() => {
        if (isSearchData) {
            searchCarAvailability();
        } else {
            setFilteredCars(cars);
        }
    }, [pickupLocation, pickupDate, returnDate, cars]);

    const displayCars = filteredCars.filter(car => {
        const matchesSearch = car.brand.toLowerCase().includes(input.toLowerCase()) || 
                             car.model.toLowerCase().includes(input.toLowerCase());
        
        const matchesTransmission = transmission === '' || car.transmission === transmission;

        return matchesSearch && matchesTransmission;
    });

    return (
        <div className="min-h-screen">
            {/* Header & Filter Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center py-20 bg-light max-md:px-4"
            >
                <Title title='Available cars' subTitle='Browse our selection of premium vehicles' />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center gap-4 mt-6 max-w-3xl w-full"
                >
                    <div className="flex items-center bg-white px-4 w-full h-12 rounded-full shadow-sm border border-gray-100 focus-within:border-primary transition-all">
                        <img src={assets.search_icon} alt="search" className="w-4 h-4 mr-2" />
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder="Search brand or model..." 
                            className="w-full h-full outline-none text-gray-600 bg-transparent" 
                        />
                    </div>

                    <select 
                        onChange={(e) => setTransmission(e.target.value)}
                        className="h-12 px-6 rounded-full bg-white border border-gray-100 shadow-sm outline-none text-gray-600 cursor-pointer appearance-none min-w-[160px] focus:border-primary transition-all"
                        value={transmission}
                    >
                        <option value="">All Transmissions</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                </motion.div>
            </motion.div>
                    
            {/* Cars Grid Section */}
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
                <div className="max-w-7xl mx-auto xl:px-20">
                    
                    {/* Animated Results Counter */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={displayCars.length} // Re-animates when count changes
                        className="text-gray-500 mb-6 font-medium"
                    >
                        {displayCars.length === 0 ? "No cars found" : `Showing ${displayCars.length} Cars`}
                    </motion.p>
                    
                    {/* Staggered Grid Animation */}
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
                    >
                        <AnimatePresence mode='popLayout'>
                            {displayCars.map((car, index) => (
                                <motion.div
                                    layout
                                    key={car._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ 
                                        duration: 0.4, 
                                        delay: index * 0.05 // Staggered entry effect
                                    }}
                                >
                                    <CarCard car={car} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Cars;