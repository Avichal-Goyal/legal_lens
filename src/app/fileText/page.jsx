"use client"

import React, { useState, useRef } from 'react';
import Step from "@/components/Step";
import axios from 'axios';
import { useRouter } from "next/navigation";

function DocumentAnalyzer() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const router = useRouter();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        alert(selectedFile ? `Uploading: ${selectedFile.name}` : "No file selected");
        const fileText = await selectedFile.text();

        // Send fileText to backend for analysis
        const response = await axios.post('/api/analyze', { text: fileText });

        console.log('Analysis response:', response.data);

        localStorage.setItem("analysisResult", JSON.stringify(response.data));

        // Redirect to results page
        router.push("/analysisResult");
    };

    return (
        <div className="flex md:flex-row-reverse w-full">
            <section
                className="md:w-3/5 w-full flex items-center justify-center bg-transparent border-l border-white/20"
            >
                <div className="w-full px-6 py-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-5xl font-bold text-white">Simple Steps to Legal Clarity</h2>
                        <p className="text-cyan-400 mt-2 text-xl">Harness the power of AI in just a few clicks.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                        <Step number="1" title="Upload or Paste" description="Securely upload your document or paste text into our analyzer."/>
                        <div className="text-white hidden md:block text-3xl font-bold">→</div>
                        <Step number="2" title="AI Analysis" description="Our powerful model processes your text in seconds, extracting key insights."/>
                        <div className="text-white hidden md:block text-3xl font-bold">→</div>
                        <Step number="3" title="Receive Insights" description="Get a clear and structured breakdown with summaries, definitions and suggestions."/>
                    </div>
                </div>
            </section>

            <div className="md:w-2/5 w-full flex items-center justify-center bg-transparent">
                <form
                    className="w-full max-w-md border-2 border-dashed border-white bg-transparent rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-8 py-4"
                    onSubmit={handleSubmit}
                >
                    <div
                        className={`w-full border-2 ${dragActive ? "border-cyan-400" : "border-gray-600"} border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer bg-transparent`}
                        onClick={handleClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <svg className="w-12 h-12 text-cyan-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M21 16.5A2.5 2.5 0 0 1 18.5 19H5.5A2.5 2.5 0 0 1 3 16.5V7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9z" />
                        </svg>
                        <p className="text-cyan-300 font-semibold text-lg mb-1">Drag & drop your file here</p>
                        <p className="text-gray-400 text-sm">or <span className="underline text-cyan-400">browse</span> to upload</p>
                        <input
                            id="myFileInput"
                            type="file"
                            className="hidden"
                            ref={inputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    {selectedFile && (
                        <div className="w-full bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-cyan-200 font-medium">{selectedFile.name}</p>
                                <p className="text-gray-400 text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button
                                type="button"
                                className="text-red-400 hover:text-red-600 font-bold text-lg"
                                onClick={() => setSelectedFile(null)}
                                title="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-colors text-lg shadow-md disabled:opacity-50"
                        disabled={!selectedFile}
                    >
                        Upload Document
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DocumentAnalyzer;