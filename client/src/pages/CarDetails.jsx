import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const CarDetails = () => {
    const { id } = useParams();
    const { cars, axios, token, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const currency = import.meta.env.VITE_CURRENCY;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // AppContext handles the Authorization header automatically via axios.defaults
            const { data } = await axios.post('/api/bookings/create', {
                car: id,
                pickupDate, 
                returnDate
            });

            if (data.success) {
                toast.success(data.message);
                // If user is logged in, show them their dashboard. 
                // If guest, take them home.
                token ? navigate('/my-bookings') : navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    }

    useEffect(() => {
        const foundCar = cars.find(car => car._id === id);
        setCar(foundCar);
    }, [cars, id]);

    if (!car) return <Loader />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 hover:text-primary transition-colors">
                <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
                Back to all cars
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                    <img src={car.image} alt="" className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md" />
                    <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
                    <p className="text-gray-500 text-lg mb-4">{car.category} • {car.year}</p>
                    <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>

                <aside>
                    <form onSubmit={handleSubmit} className="shadow-lg sticky top-24 rounded-xl p-6 space-y-6 bg-white border border-borderColor">
                        <p className="text-2xl text-gray-800 font-semibold">{currency} {car.pricePerDay} <span className="text-sm font-normal text-gray-400">/ day</span></p>
                        <div className="flex flex-col gap-2">
                            <label>Pickup Date</label>
                            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" required className="border p-2 rounded" min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Return Date</label>
                            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" required className="border p-2 rounded" min={pickupDate} />
                        </div>
                        <button className="w-full bg-primary py-3 text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
                            Book Now
                        </button>
                    </form>
                </aside>
            </div>
        </motion.div>
    );
}

export default CarDetails;