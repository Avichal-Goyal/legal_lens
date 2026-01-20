// components/navbar2.jsx
import React from 'react'

function Navbar2() {
    return (
        // 1. Reduced vertical padding (py-2 is usually sufficient)
        // 2. Removed mb-2 (bottom margin)
        // 3. Added fixed top to ensure it stays at the top
        // 4. Added w-full and z-50 for fixed positioning
        <div className="fixed top-0 w-full z-50 flex items-center px-8 py-3 bg-black shadow-lg"> 
            <h1 className="text-xl font-extrabold text-white sm:text-2xl">
                Legal Lens
            </h1>
        </div>
    )
}

export default Navbar2;