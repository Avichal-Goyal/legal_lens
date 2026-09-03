// src/app/research-hub/page.js
"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ResearchHub() {
    const [query, setQuery] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [domain, setDomain] = useState('educational'); // Default global search category

    const handleGlobalSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = { role: 'user', content: query };
        setConversation((prev) => [...prev, userMessage]);
        setQuery('');
        setLoading(true);

        try {
            // Call your new global query API (no documentId needed)
            const response = await axios.post('/api/analyze/global_query', {
                query: userMessage.content,
                domain: domain,
                // userId is handled securely by your backend session
            });

            const aiMessage = { 
                role: 'assistant', 
                content: response.data.answer,
                sources: response.data.sources,
                cached: response.data.cached
            };

            setConversation((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Global search failed:", error);
            setConversation((prev) => [...prev, { role: 'assistant', content: 'Search failed. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2">Global Knowledge Base</h1>
            <p className="text-gray-400 mb-8">Search across all your uploaded documents instantly.</p>

            {/* Category Selector */}
            <select 
                value={domain} 
                onChange={(e) => setDomain(e.target.value)}
                className="mb-8 p-3 bg-gray-800 rounded-lg outline-none border border-gray-700"
            >
                <option value="educational">Educational Papers</option>
                <option value="company_policy">Company Policies</option>
                <option value="financial">Financial Reports</option>
            </select>

            {/* Chat History */}
            <div className="w-full max-w-4xl flex-1 overflow-y-auto space-y-6 mb-8">
                {conversation.map((msg, idx) => (
                    <div key={idx} className={`p-6 rounded-xl ${msg.role === 'user' ? 'bg-cyan-900/30 border border-cyan-800' : 'bg-gray-800 border border-gray-700'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        
                        {/* Render sources if the AI pulled from multiple documents */}
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-sm text-cyan-400 font-semibold mb-2">Sources Referenced:</p>
                                <ul className="text-sm text-gray-400 list-disc pl-5">
                                    {msg.sources.map((source, i) => (
                                        <li key={i}>Document Chunk (Page {source.metadata?.page_number || 'N/A'})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {msg.cached && <span className="text-xs text-green-400 mt-2 block">⚡ Served from Cache</span>}
                    </div>
                ))}
                {loading && <div className="text-cyan-400 animate-pulse">Searching your knowledge base...</div>}
            </div>

            {/* Input Form */}
            <form onSubmit={handleGlobalSearch} className="w-full max-w-4xl flex gap-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask a question across all ${domain.replace('_', ' ')} documents...`}
                    className="flex-1 p-4 bg-gray-800 rounded-xl outline-none border border-gray-700 focus:border-cyan-400 transition-colors"
                />
                <button type="submit" disabled={loading} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-bold transition-colors disabled:opacity-50">
                    Search
                </button>
            </form>
        </div>
    );
}