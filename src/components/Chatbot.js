import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const LoadingIndicator = () => (
    <div className="flex justify-start mb-3">
        <div className="rounded-lg px-4 py-2 max-w-xs bg-gray-100 text-gray-800 border border-gray-200">
            <p className="text-sm italic">Bot is typing...</p>
        </div>
    </div>
);

const Chatbot = ({ messages, input, onInputChange, onSubmit, isLoading }) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className='bg-gray-100 min-h-screen flex items-center justify-center p-4'>
        <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-lg shadow-md h-full max-h-screen mt-4">

            {/* mt-24 ensures the chatbot starts below a typical header height */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b pb-3">
                Legal Assistant
            </h2>
            <div className="flex-1 w-full overflow-y-auto p-2">
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={onSubmit} className="w-full flex p-2 border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={onInputChange}
                    placeholder="Ask a question..."
                    className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                    disabled={!input.trim() || isLoading}
                >
                    Send
                </button>
            </form>
        </div>
        </div>
    );
};

export default Chatbot;