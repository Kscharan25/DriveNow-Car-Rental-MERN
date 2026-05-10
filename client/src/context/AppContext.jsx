import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || "$";
    const backendUrl = import.meta.env.VITE_BASE_URL?.trim();

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);
    const [showLogin, setShowLogin] = useState(false);

    // 1. Configure Axios Instance
    axios.defaults.baseURL = backendUrl;

    // 2. Interceptor Fix: Ensure token is always fresh from state or storage
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            const activeToken = token || localStorage.getItem('token');
            if (activeToken) {
                config.headers.Authorization = `Bearer ${activeToken}`;
            }
            return config;
        });

        return () => axios.interceptors.request.eject(interceptor);
    }, [token]);

    const fetchUser = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            }
        } catch (error) {
            if (error.response?.status === 401) logout();
        }
    };

    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/api/user/cars');
            if (data.success) setCars(data.cars);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        toast.success('Logged out');
        navigate('/');
    };

    useEffect(() => {
        fetchCars();
        if (token) fetchUser();
    }, [token]);

    const value = {
        navigate, currency, axios, user, setUser, token, setToken, 
        isOwner, setIsOwner, logout, fetchCars, cars, pickupDate, 
        setPickupDate, returnDate, setReturnDate,
        showLogin, setShowLogin
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);