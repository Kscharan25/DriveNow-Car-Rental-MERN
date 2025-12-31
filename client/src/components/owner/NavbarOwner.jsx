import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext'
import { motion } from 'motion/react' // Added motion for consistency

const NavbarOwner = () => {
    const { user } = useAppContext();

    return (
        <div className='flex items-center justify-between px-6 md:px-10 h-20 text-gray-500 border-b border-borderColor bg-white sticky top-0 z-50'>
            
            {/*  LOGO SECTION  */}
            <div className='flex items-center relative h-full w-48 md:w-72'>
                <Link to='/' className='absolute left-0'>
                    <motion.img 
                        whileHover={{ scale: 1.05 }}
                        src={assets.logo} 
                        alt="logo" 
                        
                        className='h-16 md:h-24 w-auto object-contain cursor-pointer scale-[1.8] md:scale-[2.2] origin-left -ml-2 md:-ml-6' 
                    />
                </Link>
            </div>

            <div className='flex items-center gap-4'>
                <p className='text-sm'>
                    Welcome, <span className='font-medium text-black'>{user?.name || "Owner"}</span>
                </p>
                <div className='hidden sm:block px-3 py-1 border border-gray-400 rounded-full text-[10px] uppercase tracking-wider'>
                    Admin Panel
                </div>
            </div>
        </div>
    )
}

export default NavbarOwner;