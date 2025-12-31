import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('')

    // ✅ FIXED: Added parentheses () to execute the hook
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

    const handleSearch = (e) => {
        e.preventDefault()
        // Standardizing the navigation path
        navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
    }

    return (
        <motion.div 
        initial={{opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.8}} className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

            <motion.h1 intial={{y:50, opacity:0}}
                animate={{y:0, opacity:1}}
                transition={{duration:0.8, delay:0.2}}  className='text-4xl md:text-5xl font-semibold'>Luxury Cars on Rent</motion.h1>

            <motion.form 
             initial={{scale:0.95, y:50,opacity:0}}
             animate={{scale:1, opacity:1, y:0}}
             transition={{duration:0.6, delay:0.4}} onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[800px] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8'>
                    
                    {/* Location Selector */}
                    <div className='flex flex-col items-start gap-2'>
                        <select className='outline-none bg-transparent cursor-pointer' required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                            <option value="">Pickup Location</option>
                            {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <p className='px-1 text-xs text-gray-500'>{pickupLocation ? pickupLocation : 'Please select Location'}</p>
                    </div>

                    {/* Pickup Date */}
                    <div className='flex flex-col items-start gap-2'>
                        <label htmlFor='pickup-date' className='text-xs font-medium text-gray-400'>Pick-up Date</label>
                        <input 
                            value={pickupDate} 
                            onChange={e => setPickupDate(e.target.value)} 
                            type="date" 
                            id="pickup-date" 
                            min={new Date().toISOString().split('T')[0]} 
                            className='text-sm text-gray-500 outline-none cursor-pointer' 
                            required 
                        />
                    </div>

                    {/* Return Date */}
                    <div className='flex flex-col items-start gap-2'>
                        <label htmlFor='return-date' className='text-xs font-medium text-gray-400'>Return Date</label>
                        <input 
                            value={returnDate} 
                            onChange={e => setReturnDate(e.target.value)} 
                            type="date" 
                            id="return-date" 
                            min={pickupDate || new Date().toISOString().split('T')[0]}
                            className='text-sm text-gray-500 outline-none cursor-pointer' 
                            required 
                        />
                    </div>
                </div>

                <motion.button 
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}} type="submit" className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-opacity-90 text-white rounded-full cursor-pointer transition-all'>
                    <img src={assets.search_icon} alt="search" className='w-4 brightness-200' />
                    Search
                </motion.button>
            </motion.form>

            <motion.img 
            initial={{y:100, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{duration:0.8, delay:0.6}} src={assets.main_car} alt="car" className='max-h-74 object-contain' />
        </motion.div>
    )
}

export default Hero