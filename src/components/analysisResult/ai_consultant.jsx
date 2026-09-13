"use client"

import { SendHorizonal, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function AIConsultant({ documentId, filename }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Ready to analyze. What specifically should I look for?', sources: [] }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom whenever messages change or stream updates
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    // Smoothed typing simulator
    const simulateStream = (replyMsg) => {
        let currentText = "";
        let index = 0;
        const fullText = replyMsg.text;

        // Add an empty AI message placeholder
        setMessages(prev => [...prev, { role: 'ai', text: '', sources: replyMsg.sources }]);

        const interval = setInterval(() => {
            if (index < fullText.length) {
                currentText += fullText[index];
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].text = currentText;
                    return updated;
                });
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20); // Slightly faster typing speed (20ms) for better responsiveness
    };

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        
        const userQuery = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userQuery, sources: [] }]);
        setIsThinking(true);

        try {
            const response = await axios.post("/api/analyze/consultant_query", {
                query: userQuery,
                history: messages,
                documentId: documentId
            });

            const assistantMsg = {
                role: 'ai',
                text: response.data.answer,
                sources: response.data.sources || []
            };

            setIsThinking(false);
            simulateStream(assistantMsg);
        } catch (error) {
            setIsThinking(false);
            console.error("Error in Assistant reply", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: 'Sorry, I encountered an error analyzing this document. Please try again.',
                sources: []
            }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-neutral-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-700">AI Consultant</h3>
                {filename && (
                    <span className="text-xs text-neutral-400 truncate max-w-[200px]">
                        Target: {filename}
                    </span>
                )}
            </div>

            {/* Chat Area with ScrollArea */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6 pb-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <Avatar className="h-8 w-8 border border-neutral-200 shrink-0">
                                <AvatarFallback className={msg.role === 'ai' ? 'bg-indigo-50 text-indigo-600 font-medium text-xs' : 'bg-neutral-900 text-white font-medium text-xs'}>
                                    {msg.role === 'ai' ? 'AI' : 'U'}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm border text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500'
                                        : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                                }`}>
                                    <div className={`prose prose-sm max-w-none
                                        ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-slate'}
                                        prose-headings:font-bold prose-a:text-indigo-500 prose-strong:text-indigo-600
                                        prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:p-2`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >{msg.text}</ReactMarkdown>
                                    </div>
                                </div>

                                {/* Source Tags */}
                                {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {msg.sources.map((src, sIdx) => (
                                            <div key={sIdx} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50/50 border border-indigo-100 rounded-full text-[10px] font-semibold text-indigo-600 shadow-2xs">
                                                <LinkIcon size={10} className="text-indigo-500" />
                                                PAGE {src.pageNumber}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Thinking Indicator */}
                    {isThinking && (
                        <div className="flex gap-3 items-center">
                            <Avatar className="h-8 w-8 border border-neutral-200 shrink-0">
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-medium text-xs">AI</AvatarFallback>
                            </Avatar>
                            <div className="bg-neutral-50 border border-neutral-100 p-3.5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-neutral-100">
                <Card className="flex items-end p-2 gap-2 border-neutral-200 shadow-xs focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask a query about the document..."
                        className="flex-1 min-h-[40px] max-h-[120px] border-0 focus-visible:ring-0 resize-none py-2 px-3 shadow-none text-sm"
                        rows={1}
                    />

                    <div className="flex items-center pb-0.5">
                        <Button
                            onClick={handleSend}
                            disabled={isThinking || !input.trim()}
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <SendHorizonal className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}