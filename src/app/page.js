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