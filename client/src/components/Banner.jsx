import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Banner = () => {
    // Parent container: Controls the stagger of children
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.15, // Items will appear one after another
                delayChildren: 0.2
            }
        }
    }

    // Text and Button items
    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    // Car Image: Combined Entrance and Floating loop
    const carVariants = {
        hidden: { opacity: 0, x: 100, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: 0.4
            }
        },
        floating: {
            y: [0, -12, 0], // The "bounce" effect
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'
        >
            <div className='text-white py-10'>
                <motion.h2 
                    variants={itemVariants} 
                    className='text-3xl md:text-4xl font-bold leading-tight'
                >
                    Do You Own a Luxury Car?
                </motion.h2> 
                
                <motion.p 
                    variants={itemVariants} 
                    className='mt-3 text-blue-50 text-lg'
                >
                    Monetize your vehicle effortlessly by listing it on CarRental.
                </motion.p>
                
                <motion.p 
                    variants={itemVariants} 
                    className='max-w-md mt-2 text-blue-100/80 text-sm md:text-base leading-relaxed'
                >
                    We take care of insurance, driver verification and secure payments — 
                    so you can earn passive income, stress-free.
                </motion.p>

                <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.95 }}
                    className='px-8 py-3 bg-white text-primary font-bold rounded-xl text-sm mt-8 cursor-pointer shadow-lg transition-colors'
                >
                    List Your Car
                </motion.button>
            </div>

            <div className='relative flex items-end'>
                <motion.img 
                    variants={carVariants}
                    animate={["visible", "floating"]} 
                    src={assets.banner_car_image} 
                    alt="luxury car" 
                    className='max-h-52 md:max-h-64 object-contain drop-shadow-2xl'
                />
            </div>
        </motion.div>
    )
}

export default Banner