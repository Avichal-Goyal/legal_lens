"use client"

import Link from "next/link";

const TABS = [
    { id: null, label: "Document" },
    { id: "summary", label: "Summary" },
    { id: "legal-jargons", label: "Legal jargons" },
    { id: "legal-clauses", label: "Legal clauses" },
];

export default function Header({ setActiveOverlay, activeOverlay = null }) {
    return (
        <header className="h-14 shrink-0 border-b border-[#DFD5BE] bg-[#F7F3EA] flex items-center justify-between px-6">
            <Link href="/" className="ll-font-display text-xl tracking-tight text-[#201C15]">
                Legal Lens
            </Link>

            <nav className="flex items-center gap-1" aria-label="Analysis sections">
                {TABS.map((tab) => {
                    const isActive = activeOverlay === tab.id;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => setActiveOverlay(tab.id)}
                            aria-current={isActive ? "page" : undefined}
                            className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3EA] ${
                                isActive
                                    ? "bg-[#F0E6CE] text-[#8B6528]"
                                    : "text-[#6B6152] hover:bg-[#EFE8D8] hover:text-[#201C15]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </header>
    );
}