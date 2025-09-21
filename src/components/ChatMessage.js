import React from 'react';

const ChatMessage = ({ sender, text }) => {
    const isUser = sender === 'user';

    return (
        <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`rounded-lg px-4 py-2 max-w-md shadow-sm ${
                    isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
            >
                {/* Using a pre-wrap to respect newlines from the bot's response */}
                <p className="text-sm whitespace-pre-wrap">{text}</p>
            </div>
        </div>
    );
};

export default ChatMessage;