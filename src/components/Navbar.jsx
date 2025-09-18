import Link from 'next/link';
import React from 'react';
export default function Navbar() {
  return (
    <header className="bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <Link href="/" className="ml-3 text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Legal Lens
          </Link>
        </div>
        <nav className="flex space-x-8">
          <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/Readers" className="text-gray-300 hover:text-blue-400 transition-colors">Readers</Link>
          <Link href="/Dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link href="/login" className="text-gray-300 hover:text-blue-400 transition-colors">Login</Link>
        </nav>
      </div>
    </header>
  );
}