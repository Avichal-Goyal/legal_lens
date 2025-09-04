import React from 'react'

function SignPage() {
    return (
        <div className="flex items-center justify-center w-screen bg-black">
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Sign Up</h2>
                <p className="text-gray-400 mb-6 text-center">Please fill in the details to create an account.</p>
                <form className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-gray-300">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <label htmlFor="password" className="text-gray-300">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
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