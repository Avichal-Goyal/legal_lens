// "use client"

// import React, { useState, useRef } from 'react';
// import Step from "@/components/Step";
// import axios from 'axios';
// import { useRouter } from "next/navigation";
// import { createFromNextReadableStream } from 'next/dist/client/components/router-reducer/fetch-server-response';

// function DocumentAnalyzer() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [dragActive, setDragActive] = useState(false);
//     const [domain, setDomain] = useState("legal");
//     const inputRef = useRef(null);
//     const router = useRouter();

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleDragOver = (event) => {
//         event.preventDefault();
//         setDragActive(true);
//     };

//     const handleDragLeave = (event) => {
//         event.preventDefault();
//         setDragActive(false);
//     };

//     const handleDrop = (event) => {
//         event.preventDefault();
//         setDragActive(false);
//         if (event.dataTransfer.files && event.dataTransfer.files[0]) {
//             setSelectedFile(event.dataTransfer.files[0]);
//         }
//     };

//     const handleClick = () => {
//         inputRef.current.click();
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (!selectedFile) {
//             alert("Please select a file before uploading!");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", selectedFile);
//         formData.append("domain", domain)

//         try {
//             const response = await axios.post("/api/analyze", formData);
//             console.log(response.data);

//             console.log("Analysis response:", response.data);

//             const storageData = {
//                 ...response.data,
//                 fileName: response.data.fileName || selectedFile.name,
//                 documentId: response.data.documentId,
//             };

//             localStorage.setItem("testAnalyze", JSON.stringify(storageData));

//             router.push("/testAnalyze");
//         } catch (error) {
//             console.error("Upload error:", error);
//             alert("Failed to analyze document. Check console for details.");
//         }
//     };


//     return (
//         <div className="flex md:flex-row-reverse w-full">
//             <section
//                 className="md:w-3/5 w-full flex items-center justify-center bg-transparent border-l border-white/20"
//             >
//                 <div className="w-full px-6 py-4">
//                     <div className="text-center mb-12">
//                         <h2 className="text-2xl md:text-5xl font-bold text-white">Simple Steps to Legal Clarity</h2>
//                         <p className="text-cyan-400 mt-2 text-xl">Harness the power of AI in just a few clicks.</p>
//                     </div>
//                     <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
//                         <Step number="1" title="Upload or Paste" description="Securely upload your document or paste text into our analyzer."/>
//                         <div className="text-white hidden md:block text-3xl font-bold">→</div>
//                         <Step number="2" title="AI Analysis" description="Our powerful model processes your text in seconds, extracting key insights."/>
//                         <div className="text-white hidden md:block text-3xl font-bold">→</div>
//                         <Step number="3" title="Receive Insights" description="Get a clear and structured breakdown with summaries, definitions and suggestions."/>
//                     </div>
//                 </div>
//             </section>

//             <div className="md:w-2/5 w-full flex items-center justify-center bg-transparent">
//                 <form
//                     className="w-full max-w-md border-2 border-dashed border-white bg-transparent rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-8 py-4"
//                     onSubmit={handleSubmit}
//                 >
//                     <div
//                         className={`w-full border-2 ${dragActive ? "border-cyan-400" : "border-gray-600"} border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer bg-transparent`}
//                         onClick={handleClick}
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop}
//                     >
//                         <svg className="w-12 h-12 text-cyan-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M21 16.5A2.5 2.5 0 0 1 18.5 19H5.5A2.5 2.5 0 0 1 3 16.5V7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9z" />
//                         </svg>
//                         <p className="text-cyan-300 font-semibold text-lg mb-1">Drag & drop your file here</p>
//                         <p className="text-gray-400 text-sm">or <span className="underline text-cyan-400">browse</span> to upload</p>
//                         <input
//                             id="myFileInput"
//                             type="file"
//                             className="hidden"
//                             ref={inputRef}
//                             onChange={handleFileChange}
//                         />
//                     </div>
//                     {selectedFile && (
//                         <div className="w-full bg-gray-700 rounded-lg p-4 flex items-center justify-between">
//                             <div>
//                                 <p className="text-cyan-200 font-medium">{selectedFile.name}</p>
//                                 <p className="text-gray-400 text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</p>
//                             </div>
//                             <button
//                                 type="button"
//                                 className="text-red-400 hover:text-red-600 font-bold text-lg"
//                                 onClick={() => setSelectedFile(null)}
//                                 title="Remove file"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                     )}
//                     <div className="w-full">
//                         <label className="text-cyan-300 text-sm font-semibold mb-1 block">Document Type</label>
//                         <select
//                             value={domain}
//                             onChange={(e) => setDomain(e.target.value)}
//                             className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 outline-none focus:border-cyan-400 transition-colors"
//                         >
//                             <option value="legal">Legal Contract</option>
//                             <option value="financial">Financial Report</option>
//                             <option value="company_policy">Company Policy / HR</option>
//                             <option value="educational">Educational / Research Paper</option>
//                         </select>
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-colors text-lg shadow-md disabled:opacity-50"
//                         disabled={!selectedFile}
//                     >
//                         Upload Document
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default DocumentAnalyzer;

"use client"

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { FileText, ShieldCheck, Lock, UploadCloud, X } from "lucide-react";
import { saveFile } from '@/lib/fileStore';

const STEPS = [
    {
        number: "01",
        title: "Upload or paste",
        description: "Securely upload your document, or paste text straight into the analyzer.",
    },
    {
        number: "02",
        title: "AI analysis",
        description: "Our model reads your text in seconds, extracting the clauses that matter.",
    },
    {
        number: "03",
        title: "Receive insights",
        description: "Get a clear, structured breakdown with summaries, definitions, and suggestions.",
    },
];

const TRUST_POINTS = [
    { icon: Lock, text: "Encrypted in transit and at rest" },
    { icon: ShieldCheck, text: "Never used to train shared models" },
];

function DocumentAnalyzer() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [domain, setDomain] = useState("legal");
    const [isUploading, setIsUploading] = useState(false);
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

        if (!selectedFile) {
            alert("Please select a file before uploading!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("domain", domain)

        try {
            setIsUploading(true);
            const response = await axios.post("/api/analyze", formData);
            console.log(response.data);

            // console.log("Analysis response:", response.data);

            if (response.data.documentId) {
                await saveFile(response.data.documentId, selectedFile);
            }

            const storageData = {
                ...response.data,
                fileName: response.data.fileName || selectedFile.name,
                documentId: response.data.documentId,
            };

            localStorage.setItem("testAnalyze", JSON.stringify(storageData));

            router.push("/testAnalyze");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to analyze document. Check console for details.");
            setIsUploading(false);
        }
    };


    return (
        <div className="ll-font-sans min-h-screen flex flex-col bg-[#F7F3EA] text-[#201C15]">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");
                .ll-font-display {
                    font-family: "Fraunces", Georgia, serif;
                }
                .ll-font-sans {
                    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
                }
            `}</style>

            {/* Top bar */}
            {/* <header className="border-b border-[#DFD5BE] px-6 py-4">
                <Link href="/" className="ll-font-display text-xl tracking-tight text-[#201C15]">
                    Legal Lens
                </Link>
            </header> */}

            <div className="flex-1 flex flex-col md:flex-row-reverse">
                {/* Steps + preview */}
                <section className="md:w-3/5 w-full flex items-center justify-center border-l border-[#DFD5BE] px-6 py-16">
                    <div className="w-full max-w-2xl">
                        <div className="mb-14">
                            <h2 className="ll-font-display text-3xl md:text-5xl leading-tight text-[#201C15]">
                                Simple steps to legal clarity
                            </h2>
                            <p className="text-[#8B6528] mt-3 text-lg">
                                Harness the power of AI in just a few clicks.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-[#DFD5BE] pt-10">
                            {STEPS.map((step) => (
                                <div key={step.number}>
                                    <span className="ll-font-display text-2xl text-[#8B6528]">{step.number}</span>
                                    <h3 className="mt-3 text-base font-medium text-[#201C15]">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#6B6152]">{step.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mini preview, echoing the home page mockup */}
                        <div className="mt-16 rounded-md border border-[#DFD5BE] bg-white shadow-sm shadow-black/5 overflow-hidden">
                            <div className="flex items-center justify-between border-b border-[#DFD5BE] px-5 py-3">
                                <span className="text-[11px] text-[#6B6152]">What you&apos;ll get, at a glance</span>
                                <span className="rounded-sm bg-[#E4EFDC] px-2 py-0.5 text-[10px] text-[#3D6B34]">
                                    Sample
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-1/2 px-5 py-4 border-b sm:border-b-0 sm:border-r border-[#DFD5BE]">
                                    <p className="ll-font-display text-sm text-[#201C15] mb-2">4. Limitation of Liability</p>
                                    <p className="text-[13px] leading-relaxed text-[#3A3527]">
                                        Neither party&apos;s liability shall be limited, and each party remains{" "}
                                        <span className="rounded-sm bg-[#F0DFB0] px-0.5 py-px ring-1 ring-[#C6A15B]/60">
                                            fully liable without any cap on damages
                                        </span>.
                                    </p>
                                </div>
                                <div className="sm:w-1/2 px-5 py-4 bg-[#F3EDDD]">
                                    <p className="text-[11px] text-[#6B6152] mb-2">Legal Lens</p>
                                    <p className="text-[12px] leading-relaxed text-[#3A3527]">
                                        This clause removes the standard liability cap — exposure is uncapped for both parties.
                                    </p>
                                    <div className="mt-2 inline-flex items-center rounded-sm bg-[#F0E6CE] px-2 py-0.5 text-[10px] text-[#8B6528]">
                                        Clause 4 · Page 2
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upload form */}
                <div className="md:w-2/5 w-full flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-md flex flex-col items-center gap-6">
                        <form
                            className="w-full border border-[#DFD5BE] bg-white rounded-md shadow-xl shadow-black/5 p-8 flex flex-col items-center gap-8"
                            onSubmit={handleSubmit}
                        >
                            <div
                                className={`w-full border-2 ${dragActive ? "border-[#C6A15B] bg-[#F3EDDD]" : "border-[#DFD5BE]"} border-dashed rounded-md flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer bg-[#F7F3EA]/60 hover:border-[#C6A15B]`}
                                onClick={handleClick}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <UploadCloud className="w-9 h-9 text-[#8B6528] mb-3" strokeWidth={1.5} />
                                <p className="text-[#201C15] font-medium text-lg mb-1">Drag &amp; drop your file here</p>
                                <p className="text-[#6B6152] text-sm">
                                    or <span className="underline decoration-[#DFD5BE] underline-offset-4 text-[#8B6528]">browse</span> to upload
                                </p>
                                <input
                                    id="myFileInput"
                                    type="file"
                                    className="hidden"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                />
                            </div>

                            {selectedFile && (
                                <div className="w-full bg-[#F3EDDD] border border-[#DFD5BE] rounded-md p-4 flex items-center gap-3">
                                    <FileText className="h-5 w-5 flex-shrink-0 text-[#8B6528]" strokeWidth={1.5} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#201C15] font-medium truncate">{selectedFile.name}</p>
                                        <p className="text-[#6B6152] text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-[#8B6528] hover:text-[#201C15] transition-colors"
                                        onClick={() => setSelectedFile(null)}
                                        title="Remove file"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="w-full">
                                <label className="text-[#6B6152] text-sm font-medium mb-1 block">Document type</label>
                                <select
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full bg-white text-[#201C15] rounded-sm p-3 border border-[#DFD5BE] outline-none focus:border-[#C6A15B] transition-colors"
                                >
                                    <option value="legal">Legal Contract</option>
                                    {/* <option value="financial">Financial Report</option>
                                    <option value="company_policy">Company Policy / HR</option> */}
                                    <option value="educational">Educational / Research Paper</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#C6A15B] hover:bg-[#D4AF6A] text-[#201C15] font-medium py-3 rounded-sm transition-colors text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                                disabled={!selectedFile || isUploading}
                            >
                                {isUploading ? "Analyzing…" : "Upload document"}
                            </button>
                        </form>

                        <div className="flex flex-col gap-2 w-full px-2">
                            {TRUST_POINTS.map((point) => {
                                const Icon = point.icon;
                                return (
                                    <div key={point.text} className="flex items-center gap-2 text-xs text-[#6B6152]">
                                        <Icon className="h-3.5 w-3.5 text-[#8B6528]" strokeWidth={1.5} />
                                        {point.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentAnalyzer;