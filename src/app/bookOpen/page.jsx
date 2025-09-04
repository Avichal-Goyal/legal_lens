"use client"
import React from 'react'

function BookOpen() {
    return (
        <div className='p-6 flex items-center space-x-4'>
            <div className='mb-4 flex gap-1'>
                <h2 className="font-serif text-3xl font-bold text-white">Law of the Day</h2>
                <p className="font-serif italic text-gray-300 mt-4">your daily dose of legal knowledge.</p>
            </div>
        </div>
    )
}

export default BookOpen;