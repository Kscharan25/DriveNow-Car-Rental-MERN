import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext'
import { motion } from 'motion/react'

const NavbarOwner = () => {
    const { user } = useAppContext();

    return (
        <div className='flex items-center justify-between px-6 md:px-10 h-20 text-gray-500 border-b border-borderColor bg-white sticky top-0 z-[60]'>
            
            {/* 1. We set pointer-events-none on this container. 
               2. We restrict the width strictly so it doesn't float over the sidebar.
            */}
            <div className='flex items-center relative h-full w-20 md:w-32 pointer-events-none z-10'>
                <Link to='/' className='relative pointer-events-auto'>
                    <motion.img 
                        whileHover={{ scale: 1.05 }}
                        src={assets.logo} 
                        alt="logo" 
                        /* The scale is huge, but 'pointer-events-auto' is only on the Link.
                           By making the parent 'w-20', the 'leak' into the sidebar is cut off.
                        */
                        className='h-14 md:h-20 w-auto object-contain cursor-pointer scale-[1.8] md:scale-[2.2] origin-left -ml-2 md:-ml-6' 
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