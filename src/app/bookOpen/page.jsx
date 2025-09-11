"use client"
import React, { useEffect, useState } from 'react';

import axios from 'axios';
function BookOpen() {
    const [law, setLaw] = useState(null);

    useEffect(() => {
        const fetchLaw = async () => {
            const response = await axios.get('/api/lawOfTheDay');
            setLaw(response.data);
        };
        fetchLaw();
    }, []);

    return (
        <div className='p-6 flex items-center space-x-4'>
            <div className='mb-4 flex gap-1'>
                <h2 className="font-serif text-3xl font-bold text-white">Law of the Day</h2>
                <p className="font-serif italic text-gray-300 mt-4">your daily dose of legal knowledge.</p>
            </div>
            <div>
                {law && (
                    <div key={law.id} className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-md max-w-xl">
                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{law.title}</h3>
                        <p className="text-gray-300">{law.description}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookOpen;