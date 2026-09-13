import React from "react";
import FeatureCard from "./featurePage";
import Link from "next/link";
import Step from "@/components/Step";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center bg-black">
      <div className="mt-12 flex flex-col items-center justify-center bg-black px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 text-center w-250">
          Clarity in Every Clause.<br/>Confidence in Every Contract.
        </h1>
        <p className="text-lg text-center md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">
          Legal Lens uses cutting-edge AI to demystify complex documents, provide instant insights, and enhance your enterprise writing.
        </p>
        <button className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl">
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20">
          <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">Our Powerful Toolkit</h2>
                  <p className="text-white mt-2">Everything you need to navigate complex documents with confidence.</p>
              </div>
              <div className="w-300 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <FeatureCard
                    title="Document Analyzer"
                    description="Upload any document—legal contracts, financial reports, or company policies—and receive a clear, concise summary in seconds. Instantly identify key clauses, obligations, and deadlines. Our AI highlights complex jargon and explains it in plain English."
                    goTo={<Link href="/fileText">Start Analyzing {">"}</Link>}
                />
                
                {/* Replaced Consultant AI with Research Hub */}
                <FeatureCard
                    title="Global Research Hub"
                    description="Search and synthesize information across your entire document library at once. Whether you are querying multiple educational research papers, comparing company policies, or aggregating financial data, get instant, AI-generated answers with precise citations drawn from all your uploaded files."
                    goTo={<Link href="/research-hub">Start Searching {">"}</Link>}
                />
                
                <FeatureCard
                    title="AI Proofreading"
                    description="Ensure your professional writing is polished and error-free. Our AI proofreader checks your documents for grammar, spelling, punctuation, and style, while also suggesting improvements for clarity and tone. Perfect for contracts, emails, and corporate correspondence."
                    goTo={<Link href="/proofReading">Start Reading {">"}</Link>}
                />
                
                <FeatureCard
                    title="Law of the Day"
                    description="Expand your knowledge with daily insights! Discover fascinating laws, landmark historical cases, or surprising legal facts delivered every day. Whether you’re a student, professional, or just curious, this feature helps you stay informed and inspired."
                    goTo={<Link href="/bookOpen">Start Learning {">"}</Link>}
                />
                
            </div>
          </div>
      </section>
    </div>
  );
}

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