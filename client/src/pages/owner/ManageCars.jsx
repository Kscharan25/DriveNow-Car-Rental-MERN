import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ManageCars = () => {
    const { isOwner, axios, currency } = useAppContext()
    const [cars, setCars] = useState([])

    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get('/api/owner/cars')
            if (data.success) setCars(data.cars)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-car', { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
            }
        } catch (error) { toast.error(error.message) }
    }

    const deleteCar = async (carId) => {
        if (!window.confirm('Delete this car?')) return
        try {
            const { data } = await axios.post('/api/owner/delete-car', { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
            }
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => { if (isOwner) fetchOwnerCars() }, [isOwner])

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='px-4 pt-10 md:px-10 w-full'
        >
            <Title title='Manage Cars' subTitle='View all listed cars...' />

            <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500 bg-gray-50'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium'>Price</th>
                            <th className='p-3 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {cars.map((car, index) => (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    key={car._id} 
                                    className='border-t border-borderColor hover:bg-gray-50'
                                >
                                    <td className='p-3 flex items-center gap-3'>
                                        <img src={car.image} alt="" className='h-12 w-12 rounded object-cover border' />
                                        <div>
                                            <p className='font-medium text-gray-800'>{car.brand} {car.model}</p>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${car.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {car.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='p-3 font-medium'>{currency}{car.pricePerDay}</td>
                                    <td className='p-3'>
                                        <div className='flex items-center justify-center gap-3'>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => toggleAvailability(car._id)}
                                            >
                                                <img src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} className='w-8' />
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => deleteCar(car._id)}
                                            >
                                                <img src={assets.delete_icon} className='w-8' />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default ManageCars;