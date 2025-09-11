"use client"
import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
function SignPage() {
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: ''
    });

    const router = useRouter();

    const signUpUser = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/userSetup/signup', user);
        if (res.data.message) {
        console.log("User signed up successfully:", res.data.message);
        alert(res.data.message);
        }
    } catch (err) {
        const errorData = err.response?.data;
        if (errorData?.redirect) {
            console.warn("User already exists, redirecting...");
            alert(errorData.error);
            router.push(errorData.redirect);
        } else {
            console.error("Signup error:", err.message);
            alert("Something went wrong. Please try again.");
        }
    }
    };

    return (
        <div className="flex items-center justify-center w-screen bg-black">
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Sign Up</h2>
                <p className="text-gray-400 mb-6 text-center">Please fill in the details to create an account.</p>
                <form className="flex flex-col gap-4" onSubmit={signUpUser}>
                    <label htmlFor="email" className="text-gray-300">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange = {(e) => setUser({...user, email: e.target.value})}
                    />
                    <label htmlFor="username" className="text-gray-300">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange = {(e) => setUser({...user, username: e.target.value})}
                    />
                    <label htmlFor="password" className="text-gray-300">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange = {(e) => setUser({...user, password: e.target.value})}
                    />
                    <button
                        type="submit"
                        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignPage;