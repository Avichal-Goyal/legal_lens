// import React from "react";
// import FeatureCard from "./featurePage";
// import Link from "next/link";
// import Step from "@/components/Step";

// export default function Page() {
//   return (
//     <div className="flex flex-col items-center justify-center bg-black">
//       <div className="mt-12 flex flex-col items-center justify-center bg-black px-4">
//         <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 text-center w-250">
//           Clarity in Every Clause.<br/>Confidence in Every Contract.
//         </h1>
//         <p className="text-lg text-center md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">
//           Legal Lens uses cutting-edge AI to demystify complex documents, provide instant insights, and enhance your enterprise writing.
//         </p>
//         <button className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl">
//           Get Started
//         </button>
//       </div>

//       {/* Features Section */}
//       <section id="features" className="py-20">
//           <div className="container mx-auto px-6">
//               <div className="text-center mb-12">
//                   <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">Our Powerful Toolkit</h2>
//                   <p className="text-white mt-2">Everything you need to navigate complex documents with confidence.</p>
//               </div>
//               <div className="w-300 grid grid-cols-1 md:grid-cols-2 gap-8">

//                 <FeatureCard
//                     title="Document Analyzer"
//                     description="Upload any document—legal contracts, financial reports, or company policies—and receive a clear, concise summary in seconds. Instantly identify key clauses, obligations, and deadlines. Our AI highlights complex jargon and explains it in plain English."
//                     goTo={<Link href="/fileText">Start Analyzing {">"}</Link>}
//                 />

//                 {/* Replaced Consultant AI with Research Hub */}
//                 <FeatureCard
//                     title="Global Research Hub"
//                     description="Search and synthesize information across your entire document library at once. Whether you are querying multiple educational research papers, comparing company policies, or aggregating financial data, get instant, AI-generated answers with precise citations drawn from all your uploaded files."
//                     goTo={<Link href="/research-hub">Start Searching {">"}</Link>}
//                 />

//                 <FeatureCard
//                     title="AI Proofreading"
//                     description="Ensure your professional writing is polished and error-free. Our AI proofreader checks your documents for grammar, spelling, punctuation, and style, while also suggesting improvements for clarity and tone. Perfect for contracts, emails, and corporate correspondence."
//                     goTo={<Link href="/proofReading">Start Reading {">"}</Link>}
//                 />

//                 <FeatureCard
//                     title="Law of the Day"
//                     description="Expand your knowledge with daily insights! Discover fascinating laws, landmark historical cases, or surprising legal facts delivered every day. Whether you’re a student, professional, or just curious, this feature helps you stay informed and inspired."
//                     goTo={<Link href="/bookOpen">Start Learning {">"}</Link>}
//                 />

//             </div>
//           </div>
//       </section>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   Scale,
//   FileSearch,
//   Network,
//   PenLine,
//   Newspaper,
//   ShieldCheck,
//   Lock,
//   Database,
//   Sparkles,
// } from "lucide-react";

// const FEATURES = [
//   {
//     icon: FileSearch,
//     title: "Document Analyzer",
//     description:
//       "Flags risk, redlines automatically, and translates dense clauses into plain English.",
//   },
//   {
//     icon: Network,
//     title: "Global Research Hub",
//     description:
//       "Searches every contract in your repository at once, with exact citations back to source.",
//   },
//   {
//     icon: PenLine,
//     title: "AI Clause Proofreader",
//     description:
//       "Polishes tone, catches jurisdiction-specific errors, and tightens syntax before you send.",
//   },
//   {
//     icon: Newspaper,
//     title: "Regulatory Feed",
//     description:
//       "Tracks statutory amendments and landmark rulings relevant to your active matters, daily.",
//   },
// ];

// const COMPLIANCE = [
//   { icon: ShieldCheck, label: "SOC 2 Type II" },
//   { icon: Lock, label: "HIPAA Compliant" },
//   { icon: Database, label: "Zero data retention for model training" },
// ];

// export default function LegalLensLanding() {
//   return (
//     <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans-ui antialiased">
//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Inter:wght@400;500;600;700&display=swap");

//         .font-serif-display {
//           font-family: "Source Serif 4", Georgia, serif;
//         }
//         .font-sans-ui {
//           font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
//         }

//         @keyframes rise-in {
//           from {
//             opacity: 0;
//             transform: translateY(14px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .rise-in {
//           animation: rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .rise-in {
//             animation: none;
//           }
//         }
//       `}</style>

//       {/* ---------------- Nav ---------------- */}
//       <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#F8F9FB]/90 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1E2A4A]">
//               <Scale className="h-4 w-4 text-white" strokeWidth={1.75} />
//             </div>
//             <span className="font-serif-display text-lg tracking-tight text-slate-900">
//               Legal Lens
//             </span>
//           </div>

//           <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
//             <a href="#solutions" className="transition-colors hover:text-slate-900">
//               Solutions
//             </a>
//             <a href="#security" className="transition-colors hover:text-slate-900">
//               Security &amp; SOC2
//             </a>
//             <a href="#pricing" className="transition-colors hover:text-slate-900">
//               Pricing
//             </a>
//           </nav>

//           <Link
//             href="/demo"
//             className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
//           >
//             Book a Demo
//           </Link>
//         </div>
//       </header>

//       {/* ---------------- Hero ---------------- */}
//       <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
//         <div className="rise-in" style={{ animationDelay: "0ms" }}>
//           <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
//             <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2} />
//             ISO 27001 Certified • Bank-Grade Document Encryption
//           </div>

//           <h1 className="mt-7 font-serif-display text-4xl leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
//             Clarity in every clause.
//             <br />
//             Confidence in every contract.
//           </h1>

//           <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
//             Enterprise-grade AI that assesses clause risk, summarizes contracts
//             instantly, and searches your entire document library in seconds.
//           </p>

//           <div className="mt-9 flex flex-wrap items-center gap-4">
//             <Link
//               href="/fileText"
//               className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
//             >
//               Analyze Document Now
//             </Link>
//             <Link
//               href="/demo"
//               className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
//             >
//               Schedule Law Firm Pilot
//             </Link>
//           </div>
//         </div>

//         {/* Hero mockup */}
//         <div className="rise-in relative" style={{ animationDelay: "120ms" }}>
//           <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border border-slate-200 bg-white/60" />
//           <div className="relative flex h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 sm:h-[400px]">
//             {/* Document pane */}
//             <div className="flex w-[62%] flex-col border-r border-slate-200">
//               <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
//                 <span className="text-[11px] font-medium text-slate-400">
//                   Mutual_NDA_v3.pdf · Page 2 of 9
//                 </span>
//                 <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
//                   Analysis Ready
//                 </span>
//               </div>
//               <div className="flex-1 overflow-hidden px-6 py-5 font-serif-display text-[13px] leading-relaxed text-slate-700">
//                 <p className="mb-3 font-semibold text-slate-900">
//                   4. Limitation of Liability
//                 </p>
//                 <p>
//                   Neither party&apos;s liability arising under this Agreement
//                   shall be limited, and each party shall remain{" "}
//                   <span className="rounded-sm bg-amber-100/80 px-0.5 py-px ring-1 ring-amber-300/60">
//                     fully liable without any cap on damages of any kind
//                   </span>
//                   , including consequential and indirect losses arising from
//                   breach of confidentiality.
//                 </p>
//                 <p className="mt-3">
//                   This Agreement shall be governed by the laws of{" "}
//                   <span className="rounded-sm bg-sky-100/80 px-0.5 py-px ring-1 ring-sky-300/60">
//                     the State of Delaware
//                   </span>
//                   , without regard to conflict of law principles.
//                 </p>
//               </div>
//             </div>

//             {/* AI sidebar pane */}
//             <div className="flex w-[38%] flex-col bg-slate-50">
//               <div className="border-b border-slate-200 px-4 py-3">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   AI Consultant
//                 </span>
//               </div>
//               <div className="flex-1 space-y-3 px-4 py-4">
//                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
//                   <Sparkles className="h-3 w-3 text-white" strokeWidth={2} />
//                 </div>
//                 <div className="rounded-lg rounded-tl-none border border-slate-200 bg-white p-3 text-[12px] leading-relaxed text-slate-700 shadow-sm">
//                   This clause removes the standard liability cap. Exposure is
//                   uncapped for both parties.
//                   <div className="mt-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200">
//                     Clause 4.2 · Page 2
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ---------------- Feature matrix ---------------- */}
//       <section id="solutions" className="mx-auto max-w-6xl px-6 py-16">
//         <h2 className="max-w-lg font-serif-display text-2xl leading-snug text-slate-900 sm:text-3xl">
//           Built to work the way legal teams already do.
//         </h2>

//         <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">
//           {FEATURES.map(({ icon: Icon, title, description }) => (
//             <div key={title} className="bg-white p-9 sm:p-10">
//               <Icon className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
//               <h3 className="mt-5 text-base font-semibold text-slate-900">
//                 {title}
//               </h3>
//               <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
//                 {description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- Compliance strip ---------------- */}
//       <section id="security" className="border-t border-slate-200">
//         <div className="mx-auto max-w-6xl px-6 py-14">
//           <p className="mb-8 text-center text-sm text-slate-500">
//             Built for the standards legal teams already require.
//           </p>
//           <div className="flex flex-col items-center justify-center gap-y-6 divide-slate-200 sm:flex-row sm:gap-x-0 sm:divide-x">
//             {COMPLIANCE.map(({ icon: Icon, label }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-2.5 px-8 text-sm font-medium text-slate-700"
//               >
//                 <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
//                 {label}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ---------------- Footer ---------------- */}
//       <footer className="border-t border-slate-200">
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
//           <div className="flex items-center gap-2">
//             <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1E2A4A]">
//               <Scale className="h-3 w-3 text-white" strokeWidth={1.75} />
//             </div>
//             <span className="font-serif-display text-slate-700">Legal Lens</span>
//           </div>
//           <p>© 2026 Legal Lens. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   FileText,
//   Search,
//   PenLine,
//   BookOpen,
//   ShieldCheck,
//   Lock,
//   Menu,
//   X,
// } from "lucide-react";

// const NAV_LINKS = [
//   { label: "Product", href: "#product" },
//   { label: "How it works", href: "#how-it-works" },
//   { label: "Security", href: "#security" },
// ];

// const FEATURES = [
//   {
//     icon: FileText,
//     title: "Document Analyzer",
//     description:
//       "Upload a contract, policy, or filing and get a clear read in seconds. Legal Lens surfaces key clauses, obligations, and deadlines, and translates dense language into plain terms.",
//     href: "/fileText",
//     linkLabel: "Analyze a document",
//   },
//   {
//     icon: Search,
//     title: "Global Research Hub",
//     description:
//       "Ask one question across your entire library. Legal Lens searches every uploaded file at once and answers with citations back to the exact page and clause.",
//     href: "/research-hub",
//     linkLabel: "Search your library",
//   },
//   {
//     icon: PenLine,
//     title: "AI Proofreading",
//     description:
//       "Catch grammar, tone, and clarity issues before a contract or client letter goes out, with edits suited to formal, professional correspondence.",
//     href: "/proofReading",
//     linkLabel: "Proofread a draft",
//   },
//   {
//     icon: BookOpen,
//     title: "Law of the Day",
//     description:
//       "A short, well-sourced legal fact, case, or ruling delivered daily — for teams who want to stay sharp between matters.",
//     href: "/bookOpen",
//     linkLabel: "Read today's brief",
//   },
// ];

// const STEPS = [
//   {
//     title: "Upload your documents",
//     description:
//       "Drop in contracts, policies, filings, or research papers. Legal Lens reads and indexes them in the background.",
//   },
//   {
//     title: "Ask a plain-language question",
//     description:
//       "Query a single file or your whole library. Legal Lens finds the passages that actually answer you.",
//   },
//   {
//     title: "Get a cited answer",
//     description:
//       "Every answer links back to its exact source, so you can verify it before you rely on it.",
//   },
// ];

// const STATS = [
//   { value: "12,000+", label: "Pages read and indexed each week" },
//   { value: "4.2 min", label: "Median time to a cited answer" },
//   { value: "6", label: "Document types understood out of the box" },
// ];

// const SECURITY_POINTS = [
//   { icon: Lock, text: "Encrypted in transit and at rest" },
//   { icon: ShieldCheck, text: "Your files are never used to train shared models" },
//   { icon: FileText, text: "Per-workspace access controls and audit history" },
// ];

// export default function Page() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-[#14120f] text-[#f3eee3]">
//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");

//         .ll-font-display {
//           font-family: "Fraunces", Georgia, serif;
//         }
//         .ll-font-sans {
//           font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
//         }
//         @keyframes ll-rise {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .ll-rise {
//           animation: ll-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .ll-rise {
//             animation: none;
//           }
//         }
//       `}</style>

//       <div className="ll-font-sans">
//         {/* Nav */}
//         <header className="sticky top-0 z-40 border-b border-[#332c20] bg-[#14120f]/95 backdrop-blur">
//           <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//             <Link href="/" className="ll-font-display text-xl tracking-tight text-[#f3eee3]">
//               Legal Lens
//             </Link>

//             <nav className="hidden items-center gap-8 text-sm text-[#9c9484] md:flex">
//               {NAV_LINKS.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   className="transition-colors hover:text-[#f3eee3]"
//                 >
//                   {link.label}
//                 </a>
//               ))}
//             </nav>

//             <div className="hidden items-center gap-6 md:flex">
//               <a
//                 href="\userSetup\sign-in"
//                 className="text-sm text-[#9c9484] transition-colors hover:text-[#f3eee3]"
//               >
//                 Log in
//               </a>
//               <Link
//                 href="/fileText"
//                 className="rounded-sm bg-[#c6a15b] px-4 py-2 text-sm font-medium text-[#14120f] transition-colors hover:bg-[#d4af6a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14120f]"
//               >
//                 Request a demo
//               </Link>
//             </div>

//             <button
//               onClick={() => setMenuOpen((v) => !v)}
//               className="text-[#f3eee3] md:hidden"
//               aria-label="Toggle menu"
//               aria-expanded={menuOpen}
//             >
//               {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>

//           {menuOpen && (
//             <div className="border-t border-[#332c20] px-6 py-4 md:hidden">
//               <nav className="flex flex-col gap-4 text-sm text-[#9c9484]">
//                 {NAV_LINKS.map((link) => (
//                   <a
//                     key={link.label}
//                     href={link.href}
//                     onClick={() => setMenuOpen(false)}
//                     className="hover:text-[#f3eee3]"
//                   >
//                     {link.label}
//                   </a>
//                 ))}
//                 <Link
//                   href="/fileText"
//                   className="mt-2 inline-block rounded-sm bg-[#c6a15b] px-4 py-2 text-center font-medium text-[#14120f]"
//                 >
//                   Request a demo
//                 </Link>
//               </nav>
//             </div>
//           )}
//         </header>

//         {/* Hero */}
//         <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
//           <div className="ll-rise" style={{ animationDelay: "0ms" }}>
//             <h1 className="ll-font-display text-4xl leading-[1.15] text-[#f3eee3] sm:text-5xl lg:text-[3.4rem]">
//               Clarity in every clause.
//               <br />
//               Confidence in every contract.
//             </h1>
//             <p className="mt-6 max-w-md text-lg leading-relaxed text-[#9c9484]">
//               Legal Lens reads, summarizes, and cross-references your documents, so your
//               team moves from first read to final answer in minutes, not hours.
//             </p>
//             <div className="mt-9 flex flex-wrap items-center gap-4">
//               <Link
//                 href="/fileText"
//                 className="rounded-sm bg-[#c6a15b] px-6 py-3 text-sm font-medium text-[#14120f] transition-colors hover:bg-[#d4af6a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14120f]"
//               >
//                 Request a demo
//               </Link>
//               <a
//                 href="#how-it-works"
//                 className="rounded-sm border border-[#332c20] px-6 py-3 text-sm font-medium text-[#f3eee3] transition-colors hover:border-[#9c9484]"
//               >
//                 See how it works
//               </a>
//             </div>
//           </div>

//           {/* Document mockup */}
//           <div className="ll-rise relative" style={{ animationDelay: "140ms" }}>
//             <div className="absolute -right-3 -top-3 h-full w-full rounded-md border border-[#332c20]" />
//             <div className="relative flex h-[380px] overflow-hidden rounded-md border border-[#332c20] bg-[#1c1914] shadow-2xl shadow-black/40 sm:h-[420px]">
//               <div className="flex w-[60%] flex-col border-r border-[#332c20]">
//                 <div className="flex items-center justify-between border-b border-[#332c20] px-5 py-3">
//                   <span className="text-[11px] text-[#9c9484]">
//                     Mutual_NDA_v3.pdf · Page 2 of 9
//                   </span>
//                   <span className="rounded-sm bg-[#2a3324] px-2 py-0.5 text-[10px] text-[#9fc47a]">
//                     Indexed
//                   </span>
//                 </div>
//                 <div className="flex-1 overflow-hidden px-6 py-5 ll-font-display text-[13px] leading-relaxed text-[#d8d2c4]">
//                   <p className="mb-3 font-medium text-[#f3eee3]">4. Limitation of Liability</p>
//                   <p>
//                     Neither party&apos;s liability arising under this Agreement shall be
//                     limited, and each party shall remain{" "}
//                     <span className="rounded-sm bg-[#4a3a1c] px-0.5 py-px text-[#f3eee3] ring-1 ring-[#c6a15b]/50">
//                       fully liable without any cap on damages
//                     </span>
//                     , including losses from a breach of confidentiality.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex w-[40%] flex-col bg-[#18150f]">
//                 <div className="border-b border-[#332c20] px-4 py-3">
//                   <span className="text-[11px] text-[#9c9484]">Legal Lens</span>
//                 </div>
//                 <div className="flex-1 px-4 py-4">
//                   <div className="rounded-md rounded-tl-none border border-[#332c20] bg-[#1c1914] p-3 text-[12px] leading-relaxed text-[#d8d2c4]">
//                     This clause removes the standard liability cap — exposure is uncapped
//                     for both parties.
//                     <div className="mt-2 inline-flex items-center rounded-sm bg-[#2a2013] px-2 py-0.5 text-[10px] text-[#c6a15b]">
//                       Clause 4 · Page 2
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Stats */}
//         <section className="border-y border-[#332c20] bg-[#1c1914]/40">
//           <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3">
//             {STATS.map((stat) => (
//               <div key={stat.label}>
//                 <p className="ll-font-display text-3xl text-[#f3eee3]">{stat.value}</p>
//                 <p className="mt-2 text-sm text-[#9c9484]">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Features */}
//         <section id="product" className="mx-auto max-w-6xl px-6 py-24">
//           <h2 className="max-w-lg ll-font-display text-2xl leading-snug text-[#f3eee3] sm:text-3xl">
//             One assistant for every document that crosses your desk.
//           </h2>
//           <div className="mt-12 divide-y divide-[#332c20] border-t border-[#332c20]">
//             {FEATURES.map((feature) => {
//               const Icon = feature.icon;
//               return (
//                 <div
//                   key={feature.title}
//                   className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10"
//                 >
//                   <Icon className="h-5 w-5 text-[#c6a15b]" strokeWidth={1.5} />
//                   <div>
//                     <h3 className="text-base font-medium text-[#f3eee3]">{feature.title}</h3>
//                     <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9c9484]">
//                       {feature.description}
//                     </p>
//                   </div>
//                   <Link
//                     href={feature.href}
//                     className="whitespace-nowrap text-sm font-medium text-[#f3eee3] underline decoration-[#332c20] underline-offset-4 transition-colors hover:decoration-[#c6a15b] sm:justify-self-end"
//                   >
//                     {feature.linkLabel}
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* How it works */}
//         <section id="how-it-works" className="border-t border-[#332c20] bg-[#1c1914]/40">
//           <div className="mx-auto max-w-6xl px-6 py-24">
//             <h2 className="max-w-lg ll-font-display text-2xl leading-snug text-[#f3eee3] sm:text-3xl">
//               From upload to answer in three steps.
//             </h2>
//             <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
//               {STEPS.map((step, i) => (
//                 <div key={step.title}>
//                   <span className="ll-font-display text-2xl text-[#c6a15b]">
//                     {String(i + 1).padStart(2, "0")}
//                   </span>
//                   <h3 className="mt-4 text-base font-medium text-[#f3eee3]">{step.title}</h3>
//                   <p className="mt-2 text-sm leading-relaxed text-[#9c9484]">
//                     {step.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Security */}
//         <section id="security" className="mx-auto max-w-6xl px-6 py-24">
//           <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
//             <div>
//               <h2 className="max-w-md ll-font-display text-2xl leading-snug text-[#f3eee3] sm:text-3xl">
//                 Your documents stay yours.
//               </h2>
//               <p className="mt-4 max-w-md text-sm leading-relaxed text-[#9c9484]">
//                 Legal Lens is built on the assumption that what you upload is sensitive.
//                 Every workspace is isolated, every file is encrypted, and nothing you
//                 upload is used to train shared models.
//               </p>
//             </div>
//             <div className="space-y-6">
//               {SECURITY_POINTS.map((point) => {
//                 const Icon = point.icon;
//                 return (
//                   <div
//                     key={point.text}
//                     className="flex items-start gap-4 border-b border-[#332c20] pb-6"
//                   >
//                     <Icon
//                       className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c6a15b]"
//                       strokeWidth={1.5}
//                     />
//                     <p className="text-sm text-[#f3eee3]">{point.text}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Final CTA */}
//         <section className="border-t border-[#332c20] bg-[#1c1914]/60">
//           <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-center">
//             <h2 className="max-w-md ll-font-display text-2xl leading-snug text-[#f3eee3] sm:text-3xl">
//               Read your next contract in minutes, not hours.
//             </h2>
//             <Link
//               href="/fileText"
//               className="whitespace-nowrap rounded-sm bg-[#c6a15b] px-6 py-3 text-sm font-medium text-[#14120f] transition-colors hover:bg-[#d4af6a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14120f]"
//             >
//               Request a demo
//             </Link>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="border-t border-[#332c20]">
//           <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-[#9c9484] sm:flex-row sm:items-center">
//             <span className="ll-font-display text-base text-[#f3eee3]">Legal Lens</span>
//             <div className="flex flex-wrap gap-x-6 gap-y-2">
//               <Link href="/fileText" className="hover:text-[#f3eee3]">
//                 Document Analyzer
//               </Link>
//               <Link href="/research-hub" className="hover:text-[#f3eee3]">
//                 Research Hub
//               </Link>
//               <Link href="/proofReading" className="hover:text-[#f3eee3]">
//                 Proofreading
//               </Link>
//               <Link href="/bookOpen" className="hover:text-[#f3eee3]">
//                 Law of the Day
//               </Link>
//             </div>
//             <p>© 2026 Legal Lens</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  PenLine,
  BookOpen,
  ShieldCheck,
  Lock,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Document Analyzer",
    description:
      "Upload a contract, policy, or filing and get a clear read in seconds. Legal Lens surfaces key clauses, obligations, and deadlines, and translates dense language into plain terms.",
    href: "/fileText",
    linkLabel: "Analyze a document",
  },
  {
    icon: Search,
    title: "Global Research Hub",
    description:
      "Ask one question across your entire library. Legal Lens searches every uploaded file at once and answers with citations back to the exact page and clause.",
    href: "/research-hub",
    linkLabel: "Search your library",
  },
  {
    icon: PenLine,
    title: "AI Proofreading",
    description:
      "Catch grammar, tone, and clarity issues before a contract or client letter goes out, with edits suited to formal, professional correspondence.",
    href: "/proofReading",
    linkLabel: "Proofread a draft",
  },
  {
    icon: BookOpen,
    title: "Law of the Day",
    description:
      "A short, well-sourced legal fact, case, or ruling delivered daily — for teams who want to stay sharp between matters.",
    href: "/bookOpen",
    linkLabel: "Read today's brief",
  },
];

const STEPS = [
  {
    title: "Upload your documents",
    description:
      "Drop in contracts, policies, filings, or research papers. Legal Lens reads and indexes them in the background.",
  },
  {
    title: "Ask a plain-language question",
    description:
      "Query a single file or your whole library. Legal Lens finds the passages that actually answer you.",
  },
  {
    title: "Get a cited answer",
    description:
      "Every answer links back to its exact source, so you can verify it before you rely on it.",
  },
];

const STATS = [
  { value: "12,000+", label: "Pages read and indexed each week" },
  { value: "4.2 min", label: "Median time to simplify your doc" },
  { value: "2", label: "Document types understood out of the box" },
];

const SECURITY_POINTS = [
  { icon: Lock, text: "Encrypted in transit and at rest" },
  { icon: ShieldCheck, text: "Your files are never used to train shared models" },
  { icon: FileText, text: "Per-workspace access controls and audit history" },
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#201C15]">
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
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ll-rise {
          animation: ll-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .ll-rise {
            animation: none;
          }
        }
      `}</style>

      <div className="ll-font-sans">
        {/* Nav */}
        <header className="sticky top-0 z-40 border-b border-[#DFD5BE] bg-[#F7F3EA]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="ll-font-display text-xl tracking-tight text-[#201C15]">
              Legal Lens
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-[#6B6152] md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-[#201C15]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/userSetup/sign-in"
                className="text-sm text-[#6B6152] transition-colors hover:text-[#201C15]"
              >
                Log in
              </Link>
              <Link
                href="/fileText"
                className="rounded-sm bg-[#C6A15B] px-4 py-2 text-sm font-medium text-[#201C15] transition-colors hover:bg-[#D4AF6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3EA]"
              >
                Request a demo
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-[#201C15] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#DFD5BE] px-6 py-4 md:hidden">
              <nav className="flex flex-col gap-4 text-sm text-[#6B6152]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[#201C15]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/fileText"
                  className="mt-2 inline-block rounded-sm bg-[#C6A15B] px-4 py-2 text-center font-medium text-[#201C15]"
                >
                  Request a demo
                </Link>
              </nav>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div className="ll-rise" style={{ animationDelay: "0ms" }}>
            <h1 className="ll-font-display text-4xl leading-[1.15] text-[#201C15] sm:text-5xl lg:text-[3.4rem]">
              Clarity in every clause.
              <br />
              Confidence in every contract.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6B6152]">
              Legal Lens reads, summarizes, and cross-references your documents, so your
              team moves from first read to final answer in minutes, not hours.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/fileText"
                className="rounded-sm bg-[#C6A15B] px-6 py-3 text-sm font-medium text-[#201C15] transition-colors hover:bg-[#D4AF6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3EA]"
              >
                Request a demo
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-sm border border-[#DFD5BE] px-6 py-3 text-sm font-medium text-[#201C15] transition-colors hover:border-[#8B6528]"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Document mockup */}
          <div className="ll-rise relative" style={{ animationDelay: "140ms" }}>
            <div className="absolute -right-3 -top-3 h-full w-full rounded-md border border-[#DFD5BE]" />
            <div className="relative flex h-[380px] overflow-hidden rounded-md border border-[#DFD5BE] bg-white shadow-xl shadow-black/5 sm:h-[420px]">
              <div className="flex w-[60%] flex-col border-r border-[#DFD5BE]">
                <div className="flex items-center justify-between border-b border-[#DFD5BE] px-5 py-3">
                  <span className="text-[11px] text-[#6B6152]">
                    Mutual_NDA_v3.pdf · Page 2 of 9
                  </span>
                  <span className="rounded-sm bg-[#E4EFDC] px-2 py-0.5 text-[10px] text-[#3D6B34]">
                    Indexed
                  </span>
                </div>
                <div className="flex-1 overflow-hidden px-6 py-5 ll-font-display text-[13px] leading-relaxed text-[#3A3527]">
                  <p className="mb-3 font-medium text-[#201C15]">4. Limitation of Liability</p>
                  <p>
                    Neither party&apos;s liability arising under this Agreement shall be
                    limited, and each party shall remain{" "}
                    <span className="rounded-sm bg-[#F0DFB0] px-0.5 py-px text-[#201C15] ring-1 ring-[#C6A15B]/60">
                      fully liable without any cap on damages
                    </span>
                    , including losses from a breach of confidentiality.
                  </p>
                </div>
              </div>
              <div className="flex w-[40%] flex-col bg-[#F3EDDD]">
                <div className="border-b border-[#DFD5BE] px-4 py-3">
                  <span className="text-[11px] text-[#6B6152]">Legal Lens</span>
                </div>
                <div className="flex-1 px-4 py-4">
                  <div className="rounded-md rounded-tl-none border border-[#DFD5BE] bg-white p-3 text-[12px] leading-relaxed text-[#3A3527]">
                    This clause removes the standard liability cap — exposure is uncapped
                    for both parties.
                    <div className="mt-2 inline-flex items-center rounded-sm bg-[#F0E6CE] px-2 py-0.5 text-[10px] text-[#8B6528]">
                      Clause 4 · Page 2
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-[#DFD5BE] bg-[#EFE8D8]/60">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="ll-font-display text-3xl text-[#201C15]">{stat.value}</p>
                <p className="mt-2 text-sm text-[#6B6152]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="product" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-lg ll-font-display text-2xl leading-snug text-[#201C15] sm:text-3xl">
            One assistant for every document that crosses your desk.
          </h2>
          <div className="mt-12 divide-y divide-[#DFD5BE] border-t border-[#DFD5BE]">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10"
                >
                  <Icon className="h-5 w-5 text-[#8B6528]" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-base font-medium text-[#201C15]">{feature.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B6152]">
                      {feature.description}
                    </p>
                  </div>
                  <Link
                    href={feature.href}
                    className="whitespace-nowrap text-sm font-medium text-[#201C15] underline decoration-[#DFD5BE] underline-offset-4 transition-colors hover:decoration-[#8B6528] sm:justify-self-end"
                  >
                    {feature.linkLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-[#DFD5BE] bg-[#EFE8D8]/60">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg ll-font-display text-2xl leading-snug text-[#201C15] sm:text-3xl">
              From upload to answer in three steps.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <span className="ll-font-display text-2xl text-[#8B6528]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-base font-medium text-[#201C15]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B6152]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="max-w-md ll-font-display text-2xl leading-snug text-[#201C15] sm:text-3xl">
                Your documents stay yours.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6B6152]">
                Legal Lens is built on the assumption that what you upload is sensitive.
                Every workspace is isolated, every file is encrypted, and nothing you
                upload is used to train shared models.
              </p>
            </div>
            <div className="space-y-6">
              {SECURITY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.text}
                    className="flex items-start gap-4 border-b border-[#DFD5BE] pb-6"
                  >
                    <Icon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8B6528]"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm text-[#201C15]">{point.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[#DFD5BE] bg-[#EFE8D8]/80">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-center">
            <h2 className="max-w-md ll-font-display text-2xl leading-snug text-[#201C15] sm:text-3xl">
              Read your next contract in minutes, not hours.
            </h2>
            <Link
              href="/fileText"
              className="whitespace-nowrap rounded-sm bg-[#C6A15B] px-6 py-3 text-sm font-medium text-[#201C15] transition-colors hover:bg-[#D4AF6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3EA]"
            >
              Request a demo
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#DFD5BE]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-[#6B6152] sm:flex-row sm:items-center">
            <span className="ll-font-display text-base text-[#201C15]">Legal Lens</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/fileText" className="hover:text-[#201C15]">
                Document Analyzer
              </Link>
              <Link href="/research-hub" className="hover:text-[#201C15]">
                Research Hub
              </Link>
              <Link href="/proofReading" className="hover:text-[#201C15]">
                Proofreading
              </Link>
              <Link href="/bookOpen" className="hover:text-[#201C15]">
                Law of the Day
              </Link>
            </div>
            <p>© 2026 Legal Lens</p>
          </div>
        </footer>
      </div>
    </div>
  );
}