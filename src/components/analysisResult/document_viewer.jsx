"use client"

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileX } from "lucide-react";

function getKind(file, name = "") {
    const type = file?.type || "";
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (type === "application/pdf" || ext === "pdf") return "pdf";
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("text/") || ["txt", "md"].includes(ext)) return "text";
    return "other";
}

export default function DocumentViewer({ file = null, text = "", fileName = "", loading = false }) {
    const [url, setUrl] = useState(null);
    const [fileText, setFileText] = useState("");
    const kind = file ? getKind(file, fileName) : null;

    // Object URL for pdf/image; read plain text files directly
    useEffect(() => {
        if (!file) {
            setUrl(null);
            setFileText("");
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        if (getKind(file, fileName) === "text") {
            file.text().then(setFileText).catch(() => setFileText(""));
        }
        return () => URL.revokeObjectURL(objectUrl);
    }, [file, fileName]);

    const bodyText = fileText || text;

    const toolbar = (
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#DFD5BE] bg-[#F7F3EA] px-5">
            <span className="truncate text-sm text-[#3A3527]">{fileName || "Document"}</span>
            {url && (
                <div className="flex items-center gap-4 text-xs text-[#8B6528]">
                    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#201C15]">
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Open in new tab
                    </a>
                    <a href={url} download={fileName || "document"} className="inline-flex items-center gap-1.5 hover:text-[#201C15]">
                        <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Download
                    </a>
                </div>
            )}
        </div>
    );

    const paper = (children) => (
        <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mx-auto my-8 max-w-3xl rounded-md border border-[#DFD5BE] bg-white px-12 py-12 shadow-sm shadow-black/5">
                {children}
            </div>
        </div>
    );

    let body;
    if (loading) {
        body = <div className="flex flex-1 items-center justify-center text-sm text-[#6B6152]">Loading document…</div>;
    } else if (kind === "pdf" && url) {
        body = <iframe title={fileName || "Document"} src={url} className="h-full w-full flex-1 border-0 bg-white" />;
    } else if (kind === "image" && url) {
        body = (
            <div className="flex-1 min-h-0 overflow-auto p-6">
                <img src={url} alt={fileName || "Uploaded document"} className="mx-auto max-w-full rounded-md border border-[#DFD5BE] bg-white" />
            </div>
        );
    } else if (bodyText) {
        body = paper(
            <div className="ll-font-display whitespace-pre-wrap text-[15px] leading-8 text-[#3A3527]">{bodyText}</div>
        );
    } else {
        body = (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <FileX className="h-8 w-8 text-[#8B6528]" strokeWidth={1.5} />
                <p className="ll-font-display text-lg text-[#201C15]">
                    {file ? "This file type can't be previewed" : "The original file isn't available"}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-[#6B6152]">
                    {file
                        ? "Download it to read the original. Your summary and chat still work."
                        : "It's only kept in the browser you uploaded it from. Upload it again to view it here."}
                </p>
            </div>
        );
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden">
            {toolbar}
            {body}
        </div>
    );
}