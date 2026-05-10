import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'

// Pages
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Cars from './pages/Cars'

// Owner Pages
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'

const App = () => {
  const { showLogin } = useAppContext()
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  return (
    <>
      <Toaster />
      
      {/* Login Modal toggled via Context State */}
      {showLogin && <Login />}
      
      {/* Only show Navbar if not in Owner Dashboard */}
      {!isOwnerPath && <Navbar />}

      <Routes>
        {/* User Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Owner Dashboard Routes */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>
      </Routes>

      {/* Only show Footer if not in Owner Dashboard */}
      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App