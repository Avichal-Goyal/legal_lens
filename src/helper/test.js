"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function DocumentAssistant({ fileName }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'ve analyzed your legal document. Ask me anything about it!',
            sources: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add user message to chat
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Call your query API
            const response = await axios.post('/api/analyze/doc_vector_storing/query', {
                query: input,
                fileName: fileName
            });

            // Add assistant response to chat
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                sources: response.data.sources || [],
                hasContext: response.data.hasContext
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Query error:', error);
            
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your question. Please try again.',
                sources: []
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[800px] bg-gray-900 rounded-lg border border-gray-700">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 rounded-t-lg border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Document Assistant</h2>
                <p className="text-sm text-gray-400 mt-1">Analyzing: {fileName}</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div key={index}>
                        {/* Message Bubble */}
                        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3xl rounded-lg px-4 py-3 ${
                                message.role === 'user' 
                                    ? 'bg-cyan-600 text-white' 
                                    : 'bg-gray-800 text-gray-100'
                            }`}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 ml-4 space-y-2">
                                <p className="text-xs text-gray-500 font-semibold">Sources:</p>
                                {message.sources.map((source, idx) => (
                                    <div 
                                        key={idx}
                                        className="bg-gray-800 border border-gray-700 rounded p-3 text-sm"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-cyan-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                                Page {source.pageNumber}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {(source.similarity * 100).toFixed(1)}% match
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs">{source.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-lg px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="bg-gray-800 px-6 py-4 rounded-b-lg border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your document..."
                        className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Thinking...' : 'Ask'}
                    </button>
                </form>
                
                {/* Suggested Questions */}
                <div className="mt-3 flex flex-wrap gap-2">
                    <p className="text-xs text-gray-500 w-full">Suggested questions:</p>
                    {[
                        "What are the key terms?",
                        "Summarize this document",
                        "What are the obligations?",
                        "Are there any termination clauses?"
                    ].map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInput(suggestion)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DocumentAssistant;