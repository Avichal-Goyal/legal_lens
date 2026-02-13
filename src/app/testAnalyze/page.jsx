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

    // Initialize
    useEffect(() => {
        const initializeAnalysis = async () => {
            const data = localStorage.getItem('analysisResult');
            
            // if (!data) {
            //     router.push('/');
            //     return;
            // }

            try {
                const parsed = JSON.parse(data);
                setFileName(parsed.fileName || 'Legal Document');
                
                if (parsed.success) {
                    setAnalysisData(parsed.data);
                    
                    // Load document text for viewer
                    await loadDocumentText(parsed.fileName);
                    
                    // Generate analyses
                    await generateAllAnalyses(parsed.fileName);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAnalysis();
    }, [router]);

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

    // Generate all analyses
    const generateAllAnalyses = async (fileName) => {
        await Promise.all([
            generateSummary(fileName),
            generateClauses(fileName),
            generateJargons(fileName)
        ]);
    };

    const generateSummary = async (fileName) => {
        setLoadingSummary(true);
        try {
            const response = await axios.post('/api/analyze/generate-summary', {
                fileName: fileName
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Summary error:', error);
            setSummary('Unable to generate summary.');
        } finally {
            setLoadingSummary(false);
        }
    };

    const generateClauses = async (fileName) => {
        setLoadingClauses(true);
        try {
            const response = await axios.post('/api/analyze/generate-clauses', {
                fileName: fileName
            });
            setClauses(response.data.clauses);
        } catch (error) {
            console.error('Clauses error:', error);
            setClauses([]);
        } finally {
            setLoadingClauses(false);
        }
    };

    const generateJargons = async (fileName) => {
        setLoadingJargons(true);
        try {
            const response = await axios.post('/api/analyze/generate-jargons', {
                fileName: fileName
            });
            setJargons(response.data.jargons);
        } catch (error) {
            console.error('Jargons error:', error);
            setJargons([]);
        } finally {
            setLoadingJargons(false);
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
            const response = await axios.post('/api/analyze/doc_vector_storing/query', {
                query: chatInput,
                fileName: fileName
            });

            const assistantMessage = {
                sender: 'bot',
                text: response.data.answer,
                sources: response.data.sources || []
            };

            setChatMessages(prev => [...prev, assistantMessage]);

            // Highlight relevant parts in document viewer
            if (response.data.sources && response.data.sources.length > 0) {
                highlightSourcesInDocument(response.data.sources);
            }

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
            color: `hsl(${index * 60}, 70%, 85%)` // Different pastel colors
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
        if (!documentText) return <p className="text-gray-500">Loading document...</p>;

        let highlighted = documentText;
        
        highlightedRanges.forEach((highlight, index) => {
            const searchText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${searchText})`, 'gi');
            highlighted = highlighted.replace(
                regex,
                `<mark id="highlight-${highlight.id}" style="background-color: ${highlight.color}; padding: 2px 4px; border-radius: 3px; cursor: pointer;" class="highlight-${highlight.id}">$1</mark>`
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-700 text-lg">Preparing your analysis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            
            {/* LEFT SIDEBAR - Analysis Sections */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
                    <button
                        onClick={handleReset}
                        className="text-white/90 hover:text-white flex items-center gap-2 mb-3 text-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        New Document
                    </button>
                    <h1 className="text-white font-bold text-lg truncate">{fileName}</h1>
                    <p className="text-white/80 text-xs mt-1">
                        {analysisData?.chunkCount} sections analyzed
                    </p>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
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
                    </div>

                    {/* Active Highlights */}
                    {highlightedRanges.length > 0 && (
                        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-900 mb-2">Active Highlights:</p>
                            <div className="space-y-1">
                                {highlightedRanges.map((highlight) => (
                                    <button
                                        key={highlight.id}
                                        onClick={() => jumpToHighlight(highlight)}
                                        className="w-full text-left text-xs p-2 rounded bg-white hover:bg-blue-100 transition-colors border border-blue-200"
                                    >
                                        <span className="font-medium">Page {highlight.pageNumber}</span>
                                        <p className="text-gray-600 truncate mt-1">{highlight.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* MIDDLE - Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Content Display */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {/* SUMMARY SECTION */}
                    {activeSection === 'summary' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Document Summary</h2>
                                        <p className="text-gray-500 text-sm">AI-generated overview</p>
                                    </div>
                                </div>
                                
                                {loadingSummary ? (
                                    <LoadingState />
                                ) : (
                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Legal Clauses</h2>
                                        <p className="text-gray-500 text-sm">Key provisions explained</p>
                                    </div>
                                </div>
                            </div>

                            {loadingClauses ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <LoadingState />
                                </div>
                            ) : (
                                clauses.map((clause, index) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{clause.title}</h3>
                                                {clause.page && (
                                                    <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full mb-3">
                                                        Page {clause.page}
                                                    </span>
                                                )}
                                                <p className="text-gray-700 leading-relaxed mb-4">{clause.content}</p>
                                                {clause.meaning && (
                                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                        <p className="text-xs font-semibold text-purple-900 mb-2">Plain English:</p>
                                                        <p className="text-gray-700 text-sm">{clause.meaning}</p>
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
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Legal Jargons</h2>
                                        <p className="text-gray-500 text-sm">Terms explained in simple language</p>
                                    </div>
                                </div>
                            </div>

                            {loadingJargons ? (
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <LoadingState />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jargons.map((jargon, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                            <div className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h3 className="font-bold text-green-700 mb-2">{jargon.term}</h3>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{jargon.meaning}</p>
                                                    {jargon.example && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-1">Example:</p>
                                                            <p className="text-xs text-gray-600 italic">"{jargon.example}"</p>
                                                        </div>
                                                    )}
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
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Full Document</h2>
                                            <p className="text-gray-500 text-sm">
                                                {highlightedRanges.length > 0 ? `${highlightedRanges.length} sections highlighted` : 'Complete document text'}
                                            </p>
                                        </div>
                                    </div>
                                    {highlightedRanges.length > 0 && (
                                        <button
                                            onClick={() => setHighlightedRanges([])}
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            Clear Highlights
                                        </button>
                                    )}
                                </div>
                                
                                <div 
                                    ref={documentViewerRef}
                                    className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-6 border border-gray-200"
                                >
                                    {renderHighlightedDocument()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR - Chat */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-400 to-teal-500">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        AI Assistant
                    </h3>
                    <p className="text-white/80 text-xs mt-1">Ask questions about the document</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.sender === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <p className="text-xs font-semibold text-gray-600">Sources:</p>
                                        {message.sources.map((source, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => jumpToHighlight({ 
                                                    id: idx, 
                                                    text: source.content.substring(0, 100),
                                                    pageNumber: source.pageNumber,
                                                    color: `hsl(${idx * 60}, 70%, 85%)`
                                                })}
                                                className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-2 text-xs transition-colors border border-gray-200"
                                            >
                                                <span className="font-semibold text-blue-600">Page {source.pageNumber}</span>
                                                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{source.content}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about the document..."
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isChatLoading}
                        />
                        <button
                            type="submit"
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </div>
        {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {badge && !loading && (
            <span className={`text-xs px-2 py-1 rounded-full ${
                active ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
            }`}>
                {badge}
            </span>
        )}
    </button>
);

const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
        <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 text-sm">Analyzing...</p>
        </div>
    </div>
);

export default BeautifulAnalysisPage;