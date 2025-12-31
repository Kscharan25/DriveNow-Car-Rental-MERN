import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from "react-hot-toast"

const Login = () => {
    const { setShowLogin, axios, setToken, navigate, setUser, setIsOwner } = useAppContext();

    const [state, setState] = useState("login"); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if (data.success) {
                // 1. Update Global Token State
                setToken(data.token);
                localStorage.setItem('token', data.token);
                
                // 2. Update Global User State (Matches backend response)
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');

                // 3. Update UI
                setShowLogin(false);
                toast.success(state === 'login' ? "Logged in!" : "Account Created!");
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Connection error");
        }
    }

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                
                <div className="w-full">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>

                {state === "register" ? (
                    <p>
                        Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">Login here</span>
                    </p>
                ) : (
                    <p>
                        Need an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">Register here</span>
                    </p>
                )}
                
                <button type="submit" className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Login