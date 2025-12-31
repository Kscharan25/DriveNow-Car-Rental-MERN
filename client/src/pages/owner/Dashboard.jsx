import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'

const Dashboard = () => {
    const { axios, isOwner, currency } = useAppContext()
    const [data, setData] = useState({
        totalCars: 0, totalBookings: 0, pendingBookings: 0, completedBookings: 0,
        recentBookings: [], monthlyRevenue: 0,
    })

    const dashboardCards = [
        { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
        { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
        { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
        { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
    ]

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/owner/dashboard')
            if (data.success) setData(data.dashboardData)
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
    }

    useEffect(() => {
        if (isOwner) fetchDashboardData()
    }, [isOwner])

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 pt-10 md:px-10 flex-1 bg-gray-50 min-h-screen"
        >
            <Title title="Admin Dashboard" subTitle="Monitor overall platform performance..." />

            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8'>
                {dashboardCards.map((card, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className='flex gap-4 items-center justify-between p-5 rounded-lg border border-borderColor bg-white shadow-sm hover:shadow-md transition-shadow'
                    >
                        <div>
                            <h1 className='text-xs text-gray-500 uppercase'>{card.title}</h1>
                            <p className='text-xl font-bold text-gray-800'>{card.value}</p>
                        </div>
                        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                            <img src={card.icon} alt="" className='h-6 w-6' />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='p-4 md:p-6 border border-borderColor rounded-lg bg-white shadow-sm max-w-2xl flex-1'
                >
                    <h1 className='text-lg font-semibold'>Recent Bookings</h1>
                    <div className='divide-y divide-borderColor mt-4'>
                        {data.recentBookings.map((booking, index) => (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                key={index} 
                                className='py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100'>
                                        <img src={assets.listIconColored} alt="" className='h-3 w-3' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-sm text-gray-800'>{booking.car?.brand} {booking.car?.model}</p>
                                        <p className='text-[10px] text-gray-400'>{booking.createdAt?.split('T')[0]}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <p className='font-semibold text-gray-700 text-sm'>{currency}{booking.price}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='p-4 md:p-6 border border-borderColor rounded-lg bg-white shadow-sm w-full md:max-w-xs'
                >
                    <h1 className='text-lg font-semibold'>Monthly Revenue</h1>
                    <div className='mt-8'>
                        <p className='text-xs text-gray-400 uppercase'>Total Earned</p>
                        <p className='text-4xl font-bold text-primary mt-1'>{currency}{data.monthlyRevenue}</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Dashboard;