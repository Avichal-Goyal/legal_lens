
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConsultantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "DISCLAIMER: I am an AI assistant and cannot provide legal advice. The information provided is for educational purposes only. Please consult with a qualified legal professional for your specific situation.",
        sender: 'bot',
        timestamp: new Date(),
        isDisclaimer: true
      },
      {
        id: 2,
        text: "Hello! I'm your Legal Lens consultant. I can help explain legal concepts and terminology. What would you like to know about today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Improved response formatting function
  const formatResponse = (text) => {
    if (!text) return null;
    
    // Split into sections based on double line breaks
    const sections = text.split('\n\n');
    const elements = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      // Check if this is the disclaimer
      if (section.startsWith('DISCLAIMER:')) {
        elements.push(
          <div key={`disclaimer-${i}`} className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 p-4 mb-4 rounded-r-lg">
            <p className="font-semibold">Important Notice</p>
            <p className="mt-1">{section.replace('DISCLAIMER:', '').trim()}</p>
          </div>
        );
        continue;
      }
      
      // Check if this is a header (bold text)
      if (section.startsWith('**') && section.endsWith('**')) {
        elements.push(
          <h3 key={`header-${i}`} className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
            {section.replace(/\*\*/g, '')}
          </h3>
        );
        continue;
      }
      
      // Check if this is a list section
      if (section.includes('* ') && section.split('\n').filter(line => line.trim().startsWith('* ')).length > 1) {
        const listItems = section.split('\n').filter(line => line.trim().startsWith('* '));
        elements.push(
          <div key={`list-${i}`} className="my-3">
            <ul className="list-disc pl-5 space-y-2">
              {listItems.map((item, idx) => (
                <li key={`item-${idx}`} className="text-gray-700 dark:text-gray-300">
                  {item.replace('* ', '').trim()}
                </li>
              ))}
            </ul>
          </div>
        );
        continue;
      }
      
      // Check if this is a table section
      if (section.includes('|') && section.includes('-')) {
        const lines = section.split('\n');
        const headerLine = lines[0];
        const separatorLine = lines[1];
        const dataLines = lines.slice(2);
        
        if (headerLine && separatorLine && dataLines.length > 0) {
          const headers = headerLine.split('|').filter(cell => cell.trim() !== '');
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {headers.map((header, idx) => (
                      <th 
                        key={`th-${idx}`} 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {dataLines.map((line, rowIdx) => {
                    const cells = line.split('|').filter(cell => cell.trim() !== '');
                    return (
                      <tr key={`tr-${rowIdx}`} className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                        {cells.map((cell, cellIdx) => (
                          <td 
                            key={`td-${rowIdx}-${cellIdx}`} 
                            className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }
      
   
      elements.push(
        <p key={`para-${i}`} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {section}
        </p>
      );
    }
    
    return <div className="space-y-3">{elements}</div>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
   
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId 
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
     
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm experiencing technical difficulties at the moment. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10极客时间h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Legal Consultant</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Get explanations about legal concepts and terminology
                </p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : message.isDisclaimer 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                    : message.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600 rounded-bl-none'
                    }`}
                >
                  <div className="text-sm md:text-base">
                    {formatResponse(message.text)}
                  </div>
                  <p className={`text-xs mt-3 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-none px-5 py-4 max-w-[75%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about legal concepts..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white px-5 py-3 rounded-r-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 极客时间 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Try asking about:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "What is the difference between a will and a trust?",
              "Explain what 'power of attorney' means",
              "What are the basic elements of a contract?",
              "What does 'liability' mean in legal terms?",
              "What is intellectual property?",
              "How does copyright protection work?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="bg-white dark:bg-gray-800 text-left p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}