import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const Navbar = () => {
    const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const changeRole = async () => {
        try {
            const { data } = await axios.post('/api/owner/change-role');
            if (data.success) {
                setIsOwner(true);
                toast.success(data.message);
                navigate('/owner/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            /* h-20 sets a fixed height for the bar */
            className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 h-20 text-gray-600 border-b border-borderColor sticky top-0 z-50 transition-all ${location.pathname === "/" ? "bg-light" : "bg-white"}`}>
            
            {/* LOGO SECTION */}
            <div className='flex items-center h-full w-48 md:w-72'>
                <Link to='/' onClick={() => setOpen(false)} className="flex items-center">
                    <motion.img 
                        whileHover={{ scale: 1.05 }} 
                        src={assets.logo} 
                        alt="logo" 
                        
                        className='h-16 md:h-24 w-auto object-contain cursor-pointer scale-[1.8] md:scale-[2.2] origin-left -ml-2 md:-ml-6' 
                    />
                </Link>
            </div>

            {/* NAV LINKS */}
            <div className={`
                max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-20 max-sm:left-0 
                flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 
                max-sm:p-6 transition-all duration-300 z-40
                ${location.pathname === "/" ? "bg-light" : "bg-white"} 
                ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"} 
                sm:translate-x-0 
            `}>
                {menuLinks.map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path} 
                        onClick={() => setOpen(false)}
                        className="hover:text-black font-medium transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}

                <div className='flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full w-full sm:max-w-56'>
                    <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search products'/>
                    <img src={assets.search_icon} alt='search' className='w-4 h-4' />
                </div>
            </div>

            {/* AUTH BUTTONS */}
            <div className='flex items-center gap-4 sm:gap-6 z-50'>
                {user ? (
                    <div className='flex items-center gap-4'>
                        <button 
                            onClick={() => isOwner ? navigate('/owner') : changeRole()} 
                            className='hidden md:block cursor-pointer hover:text-black transition-colors font-medium'
                        >
                            {isOwner ? 'Dashboard' : 'List cars'}
                        </button>
                        
                        <button 
                            onClick={() => { logout(); setOpen(false); }} 
                            className='cursor-pointer px-4 sm:px-8 py-2 bg-primary hover:bg-blue-700 transition-all text-white rounded-lg text-sm'
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => { setShowLogin(true); setOpen(false); }} 
                        className='cursor-pointer px-6 sm:px-8 py-2 bg-primary hover:bg-blue-700 transition-all text-white rounded-lg text-sm'
                    >
                        Login
                    </button>
                )}

                <button className='sm:hidden cursor-pointer p-1' aria-label="Menu" onClick={() => setOpen(!open)}>
                    <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='w-6 h-6' />
                </button>
            </div>
        </motion.div>
    );
}

export default Navbar;