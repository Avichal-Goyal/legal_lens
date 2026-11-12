// "use client"
// import {
//     ResizableHandle,
//     ResizablePanel,
//     ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { useEffect, useState } from "react";
// import Header from "@/components/analysisResult/header";
// import SummaryOverlay from "@/components/analysisResult/summary_overlay";
// import AIConsultant from "@/components/analysisResult/ai_consultant";
// import DocumentViewer from "@/components/analysisResult/document_viewer";
// import JargonOverlay from "@/components/analysisResult/jargon_overlay";
// import LegalClauses from "@/components/analysisResult/legal-clauses";
// import { useRouter } from "next/navigation";


// export default function Home() {
//     const router = useRouter();
//     const [activeOverlay, setActiveOverlay] = useState(null);
//     const [summary, setSummary] = useState('');
//     const [jargons, setJargons] = useState([]);
//     const [clauses, setClauses] = useState([]);
//     const [filename, setfilename] = useState('');
//     const [docText, setDocText] = useState('');
//     const [documentId, setDocumentId] = useState('');

//     useEffect(() => {
//         const data = localStorage.getItem('testAnalyze');

//         if(!data) {
//             router.push('/');
//             return;
//         }

//         try {
//             const parsed = JSON.parse(data);
//             if (parsed) {
//                 setfilename(parsed.fileName || 'Legal Document');
//                 setDocumentId(parsed.documentId);
//                 setSummary(parsed.summary);
//                 setClauses(parsed.keyClauses || []);
//                 setJargons(parsed.jargonBuster || []);
//             }
//         } catch (error) {
//             console.log("Error while retrieving local storgae data", error);
//         }


//     }, [])

//     return (
//         <div className="h-screen w-full flex flex-col bg-[#F7F3EA] text-[#201C15]">
//             {/* Brand type system — matches the marketing site */}
//             <style jsx global>{`
//                 @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");

//                 .ll-font-display {
//                     font-family: "Fraunces", Georgia, serif;
//                 }
//                 .ll-font-sans {
//                     font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
//                 }
//                 @keyframes ll-rise {
//                     from {
//                         opacity: 0;
//                         transform: translateY(6px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//                 .ll-rise {
//                     animation: ll-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
//                 }
//                 @media (prefers-reduced-motion: reduce) {
//                     .ll-rise {
//                         animation: none;
//                     }
//                 }

//                 /* Resizable panel divider, re-themed to the parchment/gold palette */
//                 [data-panel-resize-handle-id] {
//                     background-color: #dfd5be !important;
//                     transition: background-color 0.2s ease;
//                 }
//                 [data-panel-resize-handle-id]:hover,
//                 [data-panel-resize-handle-id][data-resize-handle-active] {
//                     background-color: #c6a15b !important;
//                 }
//             `}</style>

//             <div className="ll-font-sans flex h-full min-h-0 flex-col">
//                 <Header setActiveOverlay={setActiveOverlay} activeOverlay={activeOverlay} />

//                 {/* Main area split between the document / overlay pane and the AI consultant */}
//                 <main className="flex-1 overflow-hidden">
//                     <ResizablePanelGroup orientation="horizontal">
//                         <ResizablePanel defaultSize="60%">
//                             <div className="relative h-full w-full bg-[#EFE8D8]/40">
//                                 {(activeOverlay === null) && (
//                                     <DocumentViewer activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />
//                                 )}
//                                 {activeOverlay != null && (
//                                     <div className="ll-rise absolute inset-0 overflow-y-auto p-6">
//                                         <div className="mx-auto max-w-3xl rounded-md border border-[#DFD5BE] bg-white shadow-sm shadow-black/5">
//                                             {(activeOverlay === "summary") && <SummaryOverlay summary={summary} />}
//                                             {(activeOverlay === "legal-jargons") && <JargonOverlay jargons={jargons} />}
//                                             {(activeOverlay === "legal-clauses") && <LegalClauses clauses={clauses} />}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </ResizablePanel>
//                         <ResizableHandle />
//                         <ResizablePanel defaultSize="40%">
//                             <AIConsultant documentId={documentId} filename={filename} />
//                         </ResizablePanel>
//                     </ResizablePanelGroup>
//                 </main>
//             </div>
//         </div>
//     );
// }

"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import Header from "@/components/analysisResult/header";
import SummaryOverlay from "@/components/analysisResult/summary_overlay";
import AIConsultant from "@/components/analysisResult/ai_consultant";
import DocumentViewer from "@/components/analysisResult/document_viewer";
import JargonOverlay from "@/components/analysisResult/jargon_overlay";
import LegalClauses from "@/components/analysisResult/legal-clauses";
import { useRouter } from "next/navigation";
import { getFile } from "@/lib/fileStore";

export default function Home() {
    const router = useRouter();
    const [activeOverlay, setActiveOverlay] = useState(null);
    const [summary, setSummary] = useState('');
    const [jargons, setJargons] = useState([]);
    const [clauses, setClauses] = useState([]);
    const [filename, setfilename] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [domain, setDomain] = useState('legal');
    const [docText, setDocText] = useState('');
    const [file, setFile] = useState(null);
    const [fileLoading, setFileLoading] = useState(true);
    // Wait for localStorage so tabs don't flash the wrong labels
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('testAnalyze');

        if (!data) {
            router.push('/');
            return;
        }

        try {
            const parsed = JSON.parse(data);
            if (parsed) {
                setfilename(parsed.fileName || 'Document');
                setDocumentId(parsed.documentId);
                setSummary(parsed.summary);
                setClauses(parsed.keyClauses || []);
                setJargons(parsed.jargonBuster || []);
                setDomain(parsed.domain || 'legal');
                // If the API returns extracted text, use it as a fallback view
                setDocText(parsed.text || parsed.extractedText || parsed.documentText || '');

                // Load the original upload saved by the upload page
                getFile(parsed.documentId || 'latest')
                    .then(setFile)
                    .catch((err) => console.log("Could not load original file", err))
                    .finally(() => setFileLoading(false));
            } else {
                setFileLoading(false);
            }
        } catch (error) {
            console.log("Error while retrieving local storage data", error);
            setFileLoading(false);
        }

        setReady(true);
    }, [router])

    if (!ready) {
        return <div className="h-screen w-full bg-[#F7F3EA]" />;
    }

    return (
        <div className="h-screen w-full flex flex-col bg-[#F7F3EA] text-[#201C15]">
            {/* Brand type system — matches the marketing site */}
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");

                .ll-font-display {
                    font-family: "Fraunces", Georgia, serif;
                }
                .ll-font-sans {
                    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
                }
                @keyframes ll-rise {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .ll-rise {
                    animation: ll-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .ll-rise {
                        animation: none;
                    }
                }

                /* Resizable panel divider, re-themed to the parchment/gold palette */
                [data-panel-resize-handle-id] {
                    background-color: #dfd5be !important;
                    transition: background-color 0.2s ease;
                }
                [data-panel-resize-handle-id]:hover,
                [data-panel-resize-handle-id][data-resize-handle-active] {
                    background-color: #c6a15b !important;
                }
            `}</style>

            <div className="ll-font-sans flex h-full min-h-0 flex-col">
                <Header
                    setActiveOverlay={setActiveOverlay}
                    activeOverlay={activeOverlay}
                    domain={domain}
                />

                {/* Main area split between the document / overlay pane and the AI consultant */}
                <main className="flex-1 overflow-hidden">
                    <ResizablePanelGroup orientation="horizontal">
                        <ResizablePanel defaultSize="60%">
                            <div className="relative h-full w-full bg-[#EFE8D8]/40">
                                {activeOverlay === null && (
                                    <DocumentViewer file={file} text={docText} fileName={filename} loading={fileLoading} />
                                )}
                                {activeOverlay !== null && (
                                    <div
                                        key={activeOverlay}
                                        className="ll-rise absolute inset-0 overflow-y-auto p-6"
                                    >
                                        <div className="mx-auto max-w-3xl rounded-md border border-[#DFD5BE] bg-white shadow-sm shadow-black/5">
                                            {activeOverlay === "summary" && (
                                                <SummaryOverlay summary={summary} domain={domain} />
                                            )}
                                            {activeOverlay === "legal-jargons" && (
                                                <JargonOverlay jargons={jargons} domain={domain} />
                                            )}
                                            {activeOverlay === "legal-clauses" && (
                                                <LegalClauses clauses={clauses} domain={domain} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize="40%">
                            <AIConsultant documentId={documentId} filename={filename} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </main>
            </div>
        </div>
    );
}