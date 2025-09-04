import React from 'react';
import Link from 'next/link';

function NavbarPage() {
    return (
        <div className="navbar flex items-center justify-between px-8 py-4 bg-black shadow-md">
            <h1 className="navbar-title text-2xl font-bold text-white">Legal Lens</h1>
            <nav className="navbar-links">
                <ul className="navbar-list flex space-x-8">
                    <li className="navbar-item">
                        <Link href="/" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link href="/Readers" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Readers</Link>
                    </li>
                    <li className="navbar-item">
                        <Link href="/Dashboard" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Dashboard</Link>
                    </li>
                </ul>
            </nav>
            <Link href="/login" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Login</Link>
        </div>
    );
}

export default NavbarPage;