import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl = import.meta.env.VITE_BASE_URL?.trim();

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);

    // Set global default for all requests
    axios.defaults.baseURL = backendUrl;

    const fetchUser = async (userToken) => {
        if (!userToken) return; 
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${userToken}` } 
            });
            
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/api/user/cars');
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch Cars Error:", error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
        navigate('/');
    };

    // Load initial data
    useEffect(() => {
        fetchCars();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser(token);
        }
    }, []);

    // Sync token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser(token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const value = {
        navigate, currency, axios, user, setUser, token, setToken, 
        isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, 
        logout, fetchCars, cars, setCars, pickupDate, setPickupDate, 
        returnDate, setReturnDate
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);