"use client"

export default function Header({ setActiveOverlay }) {
    return (
        <header className="h-14 border-b boder-neutral-200 bg-white flex items-center justify-between px-6">
            <h1 className="font-bold text-neutral-900 tracking-tight">Legal Lens</h1>

            <div className="flex items-center gap-2">
                <button
                onClick={() => setActiveOverlay(null)}
                className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">Document</button>

                <button
                onClick={() => setActiveOverlay("summary")}
                className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">Summary</button>

                <button
                onClick={() => setActiveOverlay("legal-jargons")}
                className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">Legal Jargons</button>

                <button
                onClick={() => setActiveOverlay("legal-clauses")}
                className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">Legal Clauses</button>

            </div>

        </header>
    )
}