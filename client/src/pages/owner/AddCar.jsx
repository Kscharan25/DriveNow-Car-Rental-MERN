import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const AddCar = () => {
    const { axios, currency } = useAppContext()
    const [image, setImage] = useState(null)
    const [car, setCar] = useState({
        brand: '', model: '', year: '', pricePerDay: '',
        category: "", transmission: '', fuel_type: '',
        seating_capacity: '', location: '', description: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (isLoading) return
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('carData', JSON.stringify(car))
            const { data } = await axios.post('/api/owner/add-car', formData)
            if (data.success) {
                toast.success(data.message)
                setImage(null)
                setCar({ brand: '', model: '', year: '', pricePerDay: '', category: "", transmission: '', fuel_type: '', seating_capacity: '', location: '', description: '' })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className='px-4 py-10 md:px-10 flex-1'
        >
            <Title title='Add new car' subTitle='Fill in details to list a new car for booking...' />

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
                <div className='flex items-center gap-4 w-full bg-light p-4 rounded-lg border border-dashed border-borderColor'>
                    <label htmlFor="car-image">
                        <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={image ? URL.createObjectURL(image) : assets.upload_icon} 
                            className='h-16 w-16 object-cover rounded cursor-pointer bg-white border' 
                        />
                        <input type="file" id="car-image" accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
                    </label>
                    <p className='text-sm text-gray-500'>Upload car photo</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col w-full'>
                        <label>Brand</label>
                        <input type='text' placeholder='e.g. BMW' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-primary' value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label>Model</label>
                        <input type='text' placeholder='e.g. X5' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-primary' value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <div className='flex flex-col'>
                        <label>Year</label>
                        <input type='number' placeholder='2024' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
                    </div>
                    <div className='flex flex-col'>
                        <label>Daily Price ({currency})</label>
                        <input type='number' placeholder='100' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
                    </div>
                    <div className='flex flex-col'>
                        <label>Category</label>
                        <select onChange={e => setCar({ ...car, category: e.target.value })} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatch Back">Hatch Back</option>
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <div className='flex flex-col'>
                        <label>Transmission</label>
                        <select onChange={e => setCar({ ...car, transmission: e.target.value })} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Fuel Type</label>
                        <select onChange={e => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Seats</label>
                        <input type='number' placeholder='5' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Location</label>
                    <select onChange={e => setCar({ ...car, location: e.target.value })} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
                        <option value="">Select Location</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                    </select>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Description</label>
                    <textarea rows={4} placeholder='Details...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e => setCar({ ...car, description: e.target.value })}></textarea>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className='flex items-center justify-center gap-2 px-8 py-3 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:bg-gray-400'
                >
                    <img src={assets.tick_icon} alt="" />
                    {isLoading ? 'Processing...' : 'List Your Car'}
                </motion.button>
            </form>
        </motion.div>
    )
}

export default AddCar;