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


export default function Home() {
    const router = useRouter();
    const [activeOverlay, setActiveOverlay] = useState(null);
    const [summary, setSummary] = useState('');
    const [jargons, setJargons] = useState([]);
    const [clauses, setClauses] = useState([]);
    const [filename, setfilename] = useState('');
    const [docText, setDocText] = useState('');

    useEffect(() => {
        const data = localStorage.getItem('testAnalyze');

        if(!data) {
            router.push('/');
            return;
        }

        try {
            const parsed = JSON.parse(data);
            
            if (parsed) {
                setfilename(parsed.fileName || 'Legal Document');

                setSummary(parsed.summary);
                setClauses(parsed.keyClauses || []);
                setJargons(parsed.jargonBuster || []);
            }
        } catch (error) {
            console.log("Error while retrieving local storgae data", error);
        }


    }, [])

    return (
        <div className="h-screen w-full flex flex-col bg-neutral-50">
        <Header setActiveOverlay={setActiveOverlay} activeOverlay={activeOverlay} />

        {/*The Main Area divided between chatbot and document viewer*/}
        <main className="flex-1 overflow-hidden">
            <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="60%">
                { (activeOverlay === null) && <DocumentViewer activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay}/>}
                {
                (activeOverlay != null) && (
                    (
                    <div className="relative absolute inset-0">
                        {(activeOverlay === "summary") && <SummaryOverlay summary={summary} />}
                        {(activeOverlay === "legal-jargons") && <JargonOverlay jargons={jargons} />}
                        {(activeOverlay === "legal-clauses") && <LegalClauses clauses={clauses} />}
                    </div>
                    )
                )
                }
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="40%">
                <AIConsultant filename={filename}/>
            </ResizablePanel>
            </ResizablePanelGroup>
        </main>

        </div>
    );
}
