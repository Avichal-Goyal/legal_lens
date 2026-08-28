"use client"
import { SendHorizonal, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import axios from "axios";

import ReactMarkdown from 'react-markdown';


export default function AIConsultant({filename}) {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Ready to analyze. What specifically should I look for?'}
    ])
    const [isThinking, setIsThinking] = useState(false);




    // seting "streaming simulator"
    const simulateStream = (replyMsg) => {
        let currentText = ""
        let index = 0
        const fullText = replyMsg.text;

        // adding an empty AI message first
        setMessages(prev => [...prev, {role: 'ai', text: '', sources: replyMsg.sources}])

        const interval = setInterval(() => {
            if(index < fullText.length) {
                currentText += fullText[index]
                // updating the last message in the array with the new text
                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1].text = currentText
                    return updated
                })
                index++
            } else {
                clearInterval(interval)
            }
        }, 30);
    }

    const handleSend = async () => {
        if(!input.trim()) return
        setMessages(prev => [...prev, {role: 'user', text: input}])
        setIsThinking(true);

        try {
            const response = await axios.post("/api/analyze/consultant_query", {
                query: input,
                history: messages,
                fileName: filename
            });

            const assistantMsg = {
                sender: 'bot',
                text: response.data.answer,
                sources: response.data.sources || []
            };
            console.log("Assitant Answer:", assistantMsg.text);
            // setMessages(prev => [...prev, assistantMsg]);
            setIsThinking(false);
            simulateStream(assistantMsg);
        } catch (error) {
            setIsThinking(false);
            console.error("Error in Assistant reply", error);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again.',
                sources: []
            }]);

        }
        setInput("")
    }
    return(
        <div className="flex flex-col h-full bg-white border-l border-neutral-200">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-semibold text-sm text-neutral-700">AI Consultant</h3>
            </div>

            <ScrollArea className="flex-1 p-4 h-[500px]">
                <div className="space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <Avatar className="h-8 w-8 border border-neutral-200">
                                <AvatarFallback>{msg.role === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-2xl shadow-sm border ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500' 
                                    : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                                }`}>
                                    {/* TYPOGRAPHY WRAPPER */}
                                    <div className={`prose prose-sm max-w-none 
                                        ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-slate'}
                                        prose-headings:font-bold prose-a:text-indigo-500 prose-strong:text-indigo-600
                                        prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:p-2`}>
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>

                                {/* Interactive Source Tags */}
                                {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((src, sIdx) => (
                                            <div key={sIdx} className="group flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
                                                <LinkIcon size={10} className="text-indigo-500" />
                                                REF: PAGE {src.pageNumber}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isThinking && (
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border border-neutral-200">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 bg-white border-t border-neutral-100">
                <Card className="flex items-end p-2 gap-2 border-neutral-200 shadow-sm focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
                    <Textarea
                        value={input}
                        onChange = {(e) => setInput(e.target.value)}
                        onKeyDown = {(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask query about the doc..."
                        className="flex-1 min-h-[40px] border-0 focus-visible:ring-0 resize-none py-3 shadow-none"
                    />

                    <div className="flex items-center gap-2 pb-1">
                        <Button
                        onClick = {handleSend}
                        size="icon" className="h-8 w-8 rounded-full bg-neutral-900">
                            <SendHorizonal className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}