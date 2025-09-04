import React from 'react'

function FeatureCard({ icon, title, description, goTo }) {
    return (
        // Add "flex" and "flex-col" to make the card a flex container
        <div className="flex flex-col h-full bg-gray-800 p-6 rounded-lg shadow-lg">

            {/* This div will now grow to fill available space */}
            <div className="flex-grow">
                <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-gray-400">{description}</p>
            </div>

            {/* This div is pushed to the bottom. Swapped pt for a consistent mt. */}
            <div className="mt-8 text-gray-500 hover:text-blue-400 transition-colors cursor-pointer">
                {goTo}
            </div>

        </div>
    )
}

export default FeatureCard