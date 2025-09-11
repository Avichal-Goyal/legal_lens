"use client"

import Link from 'next/link';
import React from 'react';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const manageLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/userSetup/login', { email, password });
            if (res.data.message) {
                console.log("User logged in successfully:", res.data.message);
                alert(res.data.message);
            }
        } catch (err) {
            console.log("Login error:", err.response?.data?.error || "Login failed");
            alert(err.response?.data?.error || "Login failed");
        }
    }
    return (
        <div className="flex items-center justify-center bg-black">
            <div className="mt-8 bg-gray-900 bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Login</h2>
                <p className="text-gray-400 mb-6 text-center">Please enter your credentials to log in.</p>
                <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {manageLogin(e)}}>
                    <label htmlFor="email" className="text-gray-300">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password" className="text-gray-300">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded transition-colors"
                    >
                        Log In
                    </button>
                </form>
                <Link className="mt-4 text-blue-400 hover:underline block text-center" href="/signup">
                    Don't have an account? Sign up here.
                </Link>
            </div>
        </div>
    )
}

export default LoginPage;