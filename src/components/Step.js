import React from 'react'

function Step({ number, title, description }) {
    return (
        <div className="flex flex-col items-center p-6 m-4 rounded-xl w-full max-w-xs h-72 bg-transparent shadow-none">
            <div className="flex flex-col items-center w-full mb-4">
                <div className="flex justify-center w-full mb-4">
                    <div className="text-2xl border-2 border-cyan-400 rounded-full w-12 h-12 flex items-center justify-center font-bold text-cyan-400">
                        {number}
                    </div>
                </div>
                <h3 className="text-2xl font-semibold text-white text-center mb-1">{title}</h3>
            </div>
            <p className="text-center text-slate-400 text-base leading-tight max-w-xs">{description}</p>
        </div>
    )
}

export default Step;