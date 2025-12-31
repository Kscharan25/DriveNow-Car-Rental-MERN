import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ManageBookings = () => {
    const { axios, currency } = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner')
            if (data.success) setBookings(data.bookings)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerBookings()
            } else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => { fetchOwnerBookings() }, [])

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='px-4 pt-10 md:px-10 w-full'
        >
            <Title title='Manage Bookings' subTitle='Track all customer bookings...' />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500 bg-gray-50'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                            <th className='p-3 font-medium'>Total</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {bookings.map((booking, index) => (
                                <motion.tr 
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='border-t border-borderColor hover:bg-gray-50'
                                >
                                    <td className='p-3 flex items-center gap-3'>
                                        <img src={booking.car?.image} alt="" className='h-10 w-10 aspect-square rounded object-cover border' />
                                        <p className='font-medium text-gray-800'>{booking.car?.brand} {booking.car?.model}</p>
                                    </td>
                                    <td className='p-3 max-md:hidden text-xs'>
                                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                                    </td>
                                    <td className='p-3 font-semibold text-primary'>{currency}{booking.price}</td>
                                    <td className='p-3'>
                                        {booking.status === 'pending' ? (
                                            <select 
                                                onChange={(e) => changeBookingStatus(booking._id, e.target.value)} 
                                                className='px-2 py-1 text-xs border border-borderColor rounded bg-white outline-none cursor-pointer'
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirm</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {booking.status}
                                            </span>
                                        )}
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

export default ManageBookings;