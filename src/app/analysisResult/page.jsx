"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import AnalysisDisplay from '@/components/AnalysisDisplay';
import Chatbot from '@/components/Chatbot';

function AnalysisResultPage() {
    const [analysis, setAnalysis] = useState(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
    const router = useRouter();

    // Chatbot states
    const [sessionId, setSessionId] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: "Hello! Ask me any questions you have about this document." }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isBotLoading, setIsBotLoading] = useState(false);
    const [chatError, setChatError] = useState(null);

    // Effect to load analysis from localStorage
    useEffect(() => {
        const storedResult = localStorage.getItem("analysisResult");
        if (storedResult) {
            setAnalysis(JSON.parse(storedResult));
        } else {
            // If no data, redirect back to the upload page
            router.push("/fileText");
        }
        setIsLoadingAnalysis(false);
    }, [router]);

    // Handle chat submission to the backend API
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isBotLoading) return;

        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsBotLoading(true);
        setChatError(null);

        try {
            const response = await fetch('/api/consult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: chatInput, sessionId: sessionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get a response.');
            }

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.response };

            setChatMessages(prev => [...prev, botMessage]);
            if(data.sessionId) {
                setSessionId(data.sessionId); // Store the new session ID if created
            }

        } catch (error) {
            setChatError(error.message);
            const errorMessage = { sender: 'bot', text: `Sorry, I encountered an error: ${error.message}` };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsBotLoading(false);
        }
    };

    if (isLoadingAnalysis) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">Loading Analysis...</p>
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-screen bg-gray-100 font-sans">
            {/* Analysis Content Section */}
            <div className="w-full lg:w-2/3 p-4 sm:p-6 md:p-8 overflow-y-auto h-screen">
                <AnalysisDisplay analysis={analysis} />
            </div>

            {/* Chatbot Sidebar Section */}
            <div className="hidden lg:flex lg:w-1/3 flex-col bg-white border-l border-gray-200 h-screen">
                <Chatbot
                    messages={chatMessages}
                    input={chatInput}
                    onInputChange={(e) => setChatInput(e.target.value)}
                    onSubmit={handleChatSubmit}
                    isLoading={isBotLoading}
                    error={chatError}
                />
            </div>
        </div>
    );
}

export default AnalysisResultPage;