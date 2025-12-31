import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import {useAppContext} from '../../context/AppContext'

const NavbarOwner = () => {
    // Note: Once you connect your real backend, you will get this 'user' from AppContext
    const {user }= useAppContext();

    return (
        <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor bg-white sticky top-0 z-50'>
           
            <Link to='/'>
                <img src={assets.logo} alt="logo" className='h-8 cursor-pointer' />
            </Link>

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

export default NavbarOwner