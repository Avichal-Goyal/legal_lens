import { ScrollArea } from "../ui/scroll-area";

export default function DocumentViewer() {
    return (
        <div className="relative h-full w-full bg-neutral-100 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto my-8 p-12 bg-white shadow-sm border border-neutral-200 min-h-[1100px]">

                    <div className="border-b-2 border-neutral-900 pb-4 mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
                            Service Agreement
                        </h2>
                        <p className="text-2xl font-serif text-neutral-900 mt-2">
                            Software Development & Consulting Contract
                        </p>

                    </div>

                    <div className="space-y-6 text-neutral-800 font-serif leading-relaxed">
                        <p>
                            This agreement is made between <span className="bg-yellow-100 px-1">Legal Lens AI</span> and the Client as of February 2026...
                        </p>

                        <h3 className="font-sans font-bold text-lg text-neutral-900 mt-8">
                            1. Scope of Work

                        </h3>
                        <p>
                            The Consultant shall provide machine learning analysis and data mining 
                            services as specified in the project roadmap...
                        </p>

                    </div>

                </div>
            </ScrollArea>

        </div>
    );
}

// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { ZoomIn, ZoomOut, Maximize2, Search, ChevronUp, ChevronDown, X } from "lucide-react";

/**
 * Enterprise document viewer.
 *
 * `documentText` is rendered as raw HTML (dangerouslySetInnerHTML) so that
 * clause spans can carry `data-highlight-id` attributes for citation jumping,
 * e.g. `<span class="hl-caution" data-highlight-id="clause-4-2">...</span>`.
 * Sanitize this content upstream (e.g. with DOMPurify) before passing it in,
 * since it ultimately originates from a user-uploaded PDF.
 */
// export default function DocumentViewer({
//   documentText,
//   activeHighlightId,
//   onSelectText,
//   pageNumber = 1,
//   totalPages = 1,
//   onPageChange,
// }) {
//   const contentRef = useRef(null);
//   const containerRef = useRef(null);
//   const [zoom, setZoom] = useState(100);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [matchCount, setMatchCount] = useState(0);
//   const [currentMatch, setCurrentMatch] = useState(0);
//   const [pageJump, setPageJump] = useState(String(pageNumber));
//   const [toolbar, setToolbar] = useState(null);

//   useEffect(() => setPageJump(String(pageNumber)), [pageNumber]);

//   // Scroll to + pulse the highlight matching the active citation
//   useEffect(() => {
//     if (!activeHighlightId || !contentRef.current) return;
//     const el = contentRef.current.querySelector(`[data-highlight-id="${activeHighlightId}"]`);
//     if (!el) return;
//     el.scrollIntoView({ behavior: "smooth", block: "center" });
//     el.classList.add("hl-pulse");
//     const t = setTimeout(() => el.classList.remove("hl-pulse"), 1600);
//     return () => clearTimeout(t);
//   }, [activeHighlightId, documentText]);

//   const clearMatches = useCallback(() => {
//     const root = contentRef.current;
//     if (!root) return;
//     root.querySelectorAll("mark.search-hit").forEach((mark) => {
//       const parent = mark.parentNode;
//       parent.replaceChild(document.createTextNode(mark.textContent), mark);
//       parent.normalize();
//     });
//   }, []);

//   // Simple text-node search: wraps matches in <mark> via the live DOM
//   useEffect(() => {
//     const root = contentRef.current;
//     if (!root) return;
//     clearMatches();

//     if (!searchTerm.trim()) {
//       setMatchCount(0);
//       setCurrentMatch(0);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
//     const textNodes = [];
//     let node;
//     while ((node = walker.nextNode())) textNodes.push(node);

//     let found = 0;
//     textNodes.forEach((textNode) => {
//       const value = textNode.nodeValue;
//       const lower = value.toLowerCase();
//       let cursor = 0;
//       let idx;
//       const frag = document.createDocumentFragment();
//       let touched = false;
//       while ((idx = lower.indexOf(term, cursor)) !== -1) {
//         touched = true;
//         frag.appendChild(document.createTextNode(value.slice(cursor, idx)));
//         const mark = document.createElement("mark");
//         mark.className = "search-hit";
//         mark.dataset.matchIndex = String(found);
//         mark.textContent = value.slice(idx, idx + term.length);
//         frag.appendChild(mark);
//         cursor = idx + term.length;
//         found += 1;
//       }
//       if (touched) {
//         frag.appendChild(document.createTextNode(value.slice(cursor)));
//         textNode.parentNode.replaceChild(frag, textNode);
//       }
//     });

//     setMatchCount(found);
//     setCurrentMatch(found > 0 ? 1 : 0);
//   }, [searchTerm, documentText, clearMatches]);

//   useEffect(() => {
//     const root = contentRef.current;
//     if (!root || matchCount === 0) return;
//     root.querySelectorAll("mark.search-hit").forEach((m) => m.classList.remove("search-hit-active"));
//     const active = root.querySelector(`mark.search-hit[data-match-index="${currentMatch - 1}"]`);
//     if (active) {
//       active.classList.add("search-hit-active");
//       active.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }, [currentMatch, matchCount]);

//   const stepMatch = (dir) => {
//     if (matchCount === 0) return;
//     setCurrentMatch((prev) => {
//       const next = prev + dir;
//       if (next < 1) return matchCount;
//       if (next > matchCount) return 1;
//       return next;
//     });
//   };

//   const handleMouseUp = () => {
//     const selection = window.getSelection();
//     const text = selection?.toString().trim();
//     if (!text || !containerRef.current) return setToolbar(null);
//     const range = selection.getRangeAt(0);
//     if (!containerRef.current.contains(range.commonAncestorContainer)) return setToolbar(null);
//     const rect = range.getBoundingClientRect();
//     const containerRect = containerRef.current.getBoundingClientRect();
//     setToolbar({
//       x: rect.left - containerRect.left + rect.width / 2,
//       y: rect.top - containerRect.top,
//       text,
//     });
//   };

//   const handleAction = (action) => {
//     if (toolbar) onSelectText?.(toolbar.text, action);
//     setToolbar(null);
//     window.getSelection()?.removeAllRanges();
//   };

//   const submitPageJump = (e) => {
//     e.preventDefault();
//     const n = parseInt(pageJump, 10);
//     if (!Number.isNaN(n) && n >= 1 && n <= totalPages) onPageChange?.(n);
//   };

//   return (
//     <div ref={containerRef} className="relative flex h-full flex-col overflow-hidden bg-slate-100">
//       <style jsx global>{`
//         mark.search-hit { background: #fde68a; color: inherit; }
//         mark.search-hit-active { background: #f59e0b; color: white; }
//         .hl-caution { background: #fef3c7; box-shadow: 0 0 0 1px #fcd34d inset; border-radius: 2px; }
//         .hl-definition { background: #dbeafe; box-shadow: 0 0 0 1px #93c5fd inset; border-radius: 2px; }
//         @keyframes hl-pulse {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
//           30% { box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.35); }
//         }
//         .hl-pulse { animation: hl-pulse 1.4s ease-out; }
//       `}</style>

//       <div
//         className="flex-1 overflow-y-auto py-10"
//         onMouseUp={handleMouseUp}
//         onScroll={() => setToolbar(null)}
//       >
//         <div
//           className="mx-auto min-h-[1100px] max-w-4xl border border-slate-200 bg-white px-16 py-14 shadow-sm"
//           style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
//         >
//           <div
//             ref={contentRef}
//             className="font-serif-display text-[15px] leading-relaxed text-slate-800"
//             dangerouslySetInnerHTML={{ __html: documentText }}
//           />
//         </div>
//       </div>

//       {toolbar && (
//         <div
//           className="absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border border-slate-700 bg-slate-900 px-1 py-1 text-xs text-white shadow-lg"
//           style={{ left: toolbar.x, top: toolbar.y - 8 }}
//         >
//           <div className="flex items-center gap-1">
//             <button onClick={() => handleAction("explain")} className="rounded px-2.5 py-1.5 font-medium hover:bg-slate-700">
//               Explain with AI
//             </button>
//             <div className="h-4 w-px bg-slate-700" />
//             <button onClick={() => handleAction("addToLibrary")} className="rounded px-2.5 py-1.5 font-medium hover:bg-slate-700">
//               Add to Clause Library
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="sticky bottom-6 left-1/2 z-10 flex w-fit -translate-x-1/2 items-center gap-1 self-center rounded-full border border-slate-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur">
//         <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Zoom out">
//           <ZoomOut className="h-4 w-4" />
//         </button>
//         <span className="w-10 text-center text-xs font-medium text-slate-600">{zoom}%</span>
//         <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Zoom in">
//           <ZoomIn className="h-4 w-4" />
//         </button>
//         <button onClick={() => setZoom(100)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Fit to width">
//           <Maximize2 className="h-4 w-4" />
//         </button>

//         <div className="mx-1 h-5 w-px bg-slate-200" />

//         <form onSubmit={submitPageJump} className="flex items-center gap-1">
//           <input
//             value={pageJump}
//             onChange={(e) => setPageJump(e.target.value)}
//             className="w-10 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-center text-xs text-slate-700 outline-none focus:border-indigo-400"
//           />
//           <span className="text-xs text-slate-400">/ {totalPages}</span>
//         </form>

//         <div className="mx-1 h-5 w-px bg-slate-200" />

//         <div className="flex items-center gap-1">
//           <Search className="h-3.5 w-3.5 text-slate-400" />
//           <input
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search"
//             className="w-24 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
//           />
//           {searchTerm && (
//             <>
//               <span className="whitespace-nowrap text-[11px] text-slate-400">
//                 {matchCount > 0 ? `${currentMatch} of ${matchCount}` : "0"}
//               </span>
//               <button onClick={() => stepMatch(-1)} className="p-0.5 text-slate-400 hover:text-slate-600">
//                 <ChevronUp className="h-3.5 w-3.5" />
//               </button>
//               <button onClick={() => stepMatch(1)} className="p-0.5 text-slate-400 hover:text-slate-600">
//                 <ChevronDown className="h-3.5 w-3.5" />
//               </button>
//               <button onClick={() => setSearchTerm("")} className="p-0.5 text-slate-400 hover:text-slate-600">
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }