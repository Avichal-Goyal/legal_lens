"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

function BeautifulAnalysisPage() {
    const router = useRouter();

    // Document and analysis state
    const [fileName, setFileName] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Active section
    const [activeSection, setActiveSection] = useState('summary'); // summary, clauses, jargons, document

    // Analysis results
    const [summary, setSummary] = useState('');
    const [clauses, setClauses] = useState([]);
    const [jargons, setJargons] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingClauses, setLoadingClauses] = useState(false);
    const [loadingJargons, setLoadingJargons] = useState(false);
    
    // Document viewer state
    const [documentText, setDocumentText] = useState('');
    const [highlightedRanges, setHighlightedRanges] = useState([]);
    const [currentHighlight, setCurrentHighlight] = useState(null);
    
    // Chat state
    const [chatMessages, setChatMessages] = useState([{
        sender: 'bot',
        text: 'Hello! I can help you understand this legal document. Ask me anything!',
        sources: []
    }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    const messagesEndRef = useRef(null);
    const documentViewerRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
    const initializeAnalysis = async () => {
        // You mentioned saving under 'testAnalyze2' in your DocumentAnalyzer
        const data = localStorage.getItem('testAnalyze2');

        
        if (!data) {
            router.push('/');
            return;
        }

        try {
            console.log(data);
            const parsed = JSON.parse(data);
            setFileName(parsed.fileName || 'Legal Document');

            // Your backend sends data wrapped in a 'data' key: { success: true, data: {...} }
            // const aiResults = parsed.aiAnalysis;

            if (parsed) {
                // Map the new backend field names to your component state
                setSummary(parsed.summary || '');
                setClauses(parsed.keyClauses || []);
                setJargons(parsed.jargonBuster || []);

                // Optional Loading of Document Text
                // Only load if you specifically want to; otherwise, it stays empty
                // await loadDocumentText(parsed.fileName);
            }
        } catch (error) {
            console.error('Error parsing analysis results:', error);
            setIsLoading(false);
        } finally {
            // Turn off the main page loader immediately since data is in localStorage
            setIsLoading(false);
        }
    };

    initializeAnalysis();
}, []);

    // Load full document text
    const loadDocumentText = async (fileName) => {
        try {
            // Get all chunks for this document from Supabase
            const response = await axios.post('/api/analyze/get-document-text', {
                fileName: fileName
            });
            setDocumentText(response.data.fullText);
        } catch (error) {
            console.error('Error loading document:', error);
            setDocumentText('Document text not available for viewing.');
        }
    };


    // Chat handlers
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        
        if (!chatInput.trim()) return;

        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const response = await axios.post("/api/analyze/consultant_query", {
                query: chatInput,
                history: chatMessages,
                fileName: fileName
            });

            const assistantMessage = {
                sender: 'bot',
                text: response.data.answer,
                sources: response.data.sources || []
            };

            setChatMessages(prev => [...prev, assistantMessage]);

            // Highlight relevant parts in document viewer
            // if (response.data.sources && response.data.sources.length > 0) {
            //     highlightSourcesInDocument(response.data.sources);
            // }

        } catch (error) {
            console.error('Query error:', error);
            setChatMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again.',
                sources: []
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Highlight sources in document
    const highlightSourcesInDocument = (sources) => {
        const highlights = sources.map((source, index) => ({
            id: index,
            text: source.content.substring(0, 100), // First 100 chars to search
            pageNumber: source.pageNumber,
            //color: `hsl(${index * 60}, 70%, 50%)` // Vibrant colors for dark theme
            color: index % 2 === 0 ? '#22d3ee' : "#a855f7",// cyan and purple
        }));
        
        setHighlightedRanges(highlights);
        setActiveSection('document'); // Switch to document view
    };

    // Navigate to specific highlight
    const jumpToHighlight = (highlight) => {
        setCurrentHighlight(highlight);
        setActiveSection('document');
        
        // Scroll to highlight in document viewer
        setTimeout(() => {
            const element = document.getElementById(`highlight-${highlight.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleReset = () => {
        localStorage.removeItem('analysisResult');
        router.push('/');
    };

    // Render highlighted document
    const renderHighlightedDocument = () => {
        if (!documentText) {
            return (
            <div className="text-center py-10">
                <p className="text-gray-400">Document text viewing is disabled or not loaded.</p>
                <button
                    onClick={() => loadDocumentText(fileName)}
                    className="mt-4 text-cyan-400 underline"
                >
                    Load text now
                </button>
            </div>
        );
        }

        let highlighted = documentText;
        
        highlightedRanges.forEach((highlight, index) => {
            const searchText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${searchText})`, 'gi');
            highlighted = highlighted.replace(
                regex,
                `<mark id="highlight-${highlight.id}" style="background-color: ${highlight.color}; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-weight: 500;" class="highlight-${highlight.id}">$1</mark>`
            );
        });

        return (
            <div 
                dangerouslySetInnerHTML={{ __html: highlighted }}
                className="whitespace-pre-wrap leading-relaxed"
            />
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                        <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-lg font-medium">Preparing your analysis...</p>
                    <p className="text-gray-500 text-sm mt-2">Processing document with AI</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
            
            {/* LEFT SIDEBAR - Analysis Sections */}
            <div className="w-80 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
                    <button
                        onClick={handleReset}
                        className="text-gray-300 hover:text-white flex items-center gap-2 mb-4 text-sm transition-all hover:translate-x-1 group"
                    >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        New Document
                    </button>
                    <h1 className="text-white font-bold text-xl truncate mb-1 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {fileName}
                    </h1>
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        {analysisData?.chunkCount} sections analyzed
                    </p>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <NavButton
                        active={activeSection === 'summary'}
                        onClick={() => setActiveSection('summary')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        label="Summary"
                        loading={loadingSummary}
                    />
                    
                    <NavButton
                        active={activeSection === 'clauses'}
                        onClick={() => setActiveSection('clauses')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        label="Legal Clauses"
                        badge={clauses.length}
                        loading={loadingClauses}
                    />
                    
                    <NavButton
                        active={activeSection === 'jargons'}
                        onClick={() => setActiveSection('jargons')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
                        label="Legal Jargons"
                        badge={jargons.length}
                        loading={loadingJargons}
                    />
                    
                    <NavButton
                        active={activeSection === 'document'}
                        onClick={() => setActiveSection('document')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        }
                        label="Full Document"
                        badge={highlightedRanges.length > 0 ? `${highlightedRanges.length} highlights` : null}
                    />

                    {/* Active Highlights */}
                    {highlightedRanges.length > 0 && (
                        <div className="mt-6 p-4 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                            <p className="text-xs font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                Active Highlights
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                {highlightedRanges.map((highlight) => (
                                    <button
                                        key={highlight.id}
                                        onClick={() => jumpToHighlight(highlight)}
                                        className="w-full text-left text-xs p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/50 hover:border-cyan-500/50 group"
                                    >
                                        <span className="font-semibold text-cyan-400 group-hover:text-cyan-300">Page {highlight.pageNumber}</span>
                                        <p className="text-gray-400 truncate mt-1 text-xs">{highlight.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* MIDDLE - Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Content Display */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    
                    {/* SUMMARY SECTION */}
                    {activeSection === 'summary' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Document Summary</h2>
                                        <p className="text-gray-400 text-sm mt-1">AI-generated overview</p>
                                    </div>
                                </div>
                                
                                {loadingSummary ? (
                                    <LoadingState />
                                ) : (
                                    <div className="prose prose-invert prose-cyan max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                            {summary || 'No summary available.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CLAUSES SECTION */}
                    {activeSection === 'clauses' && (
                        <div className="max-w-4xl mx-auto space-y-4">
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Legal Clauses</h2>
                                        <p className="text-gray-400 text-sm">Key provisions explained</p>
                                    </div>
                                </div>
                            </div>

                            {loadingClauses ? (
                                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                                    <LoadingState />
                                </div>
                            ) : (
                                clauses.map((clause, index) => (
                                    <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10 group">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-2">{clause.title}</h3>
                                                {clause.page && (
                                                    <span className="inline-block bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full mb-3 border border-purple-500/30">
                                                        Page {clause.page}
                                                    </span>
                                                )}
                                                <p className="text-gray-300 leading-relaxed mb-4">{clause.explanation}</p>
                                                {clause.meaning && (
                                                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
                                                        <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Plain English
                                                        </p>
                                                        {/* <p className="text-gray-300 text-sm">{clause.meaning}</p> */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* JARGONS SECTION */}
                    {activeSection === 'jargons' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Legal Jargons</h2>
                                        <p className="text-gray-400 text-sm">Terms explained in simple language</p>
                                    </div>
                                </div>
                            </div>

                            {loadingJargons ? (
                                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                                    <LoadingState />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jargons.map((jargon, index) => (
                                        <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 group">
                                            <div className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-emerald-400 mb-2 text-lg">{jargon.term}</h3>
                                                    <p className="text-gray-300 text-sm leading-relaxed">{jargon.definition}</p>
                                                    {/* {jargon.example && (
                                                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                                                            <p className="text-xs text-emerald-400 font-semibold mb-1">Example:</p>
                                                            <p className="text-xs text-gray-400 italic">"{jargon.example}"</p>
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DOCUMENT VIEWER */}
                    {activeSection === 'document' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Full Document</h2>
                                            <p className="text-gray-400 text-sm">
                                                {highlightedRanges.length > 0 ? `${highlightedRanges.length} sections highlighted` : 'Complete document text'}
                                            </p>
                                        </div>
                                    </div>
                                    {highlightedRanges.length > 0 && (
                                        <button
                                            onClick={() => setHighlightedRanges([])}
                                            className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear Highlights
                                        </button>
                                    )}
                                </div>
                                
                                <div 
                                    ref={documentViewerRef}
                                    className="prose prose-invert prose-sm max-w-none text-gray-300 bg-slate-900/50 rounded-xl p-6 border border-slate-700/50"
                                >
                                    {renderHighlightedDocument()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR - Chat */}
            <div className="w-96 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-l border-slate-700/50 flex flex-col shadow-2xl">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        AI Assistant
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Ask questions about the document
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.sender === 'user'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                    : 'bg-slate-800/70 border border-slate-700/50 text-gray-200 shadow-lg backdrop-blur-sm'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{typeof message.text === 'object' 
            ? (message.text.rawText || message.text.answer || JSON.stringify(message.text))
            : message.text}</p>
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            Sources
                                        </p>
                                        {message.sources.map((source, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => jumpToHighlight({ 
                                                    id: idx, 
                                                    text: source.content.substring(0, 100),
                                                    pageNumber: source.pageNumber,
                                                    color: `hsl(${idx * 60}, 70%, 50%)`
                                                })}
                                                className="w-full text-left bg-slate-900/50 hover:bg-slate-700/50 rounded-lg p-3 text-xs transition-all border border-slate-700/50 hover:border-cyan-500/50 group"
                                            >
                                                <span className="font-semibold text-cyan-400 group-hover:text-cyan-300">Page {source.pageNumber}</span>
                                                <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{source.content}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isChatLoading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
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

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about the document..."
                            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm transition-all"
                            disabled={isChatLoading}
                        />
                        <button
                            type="submit"
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Helper Components
const NavButton = ({ active, onClick, icon, label, badge, loading }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
            active
                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                : 'text-gray-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50'
        }`}
    >
        <div className="flex items-center gap-3">
            <div className={active ? 'scale-110' : ''}>
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
        {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {badge && !loading && (
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                active ? 'bg-white/20 text-white' : 'bg-slate-700 text-gray-300'
            }`}>
                {badge}
            </span>
        )}
    </button>
);

const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="text-gray-400 text-sm">Analyzing document...</p>
        </div>
    </div>
);

export default BeautifulAnalysisPage;