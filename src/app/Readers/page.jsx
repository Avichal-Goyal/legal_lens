"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import { checkJargonMeaning } from '@/lib/gemini';
import { Search, FileText, BookOpen, Briefcase, ChevronRight, Scale } from 'lucide-react';

// --- Mock Data (In a real app, this would come from your backend API) ---

const articles = [
    {
        title: "Understanding Your First Employment Contract",
        icon: Briefcase,
        takeaways: ["Roles & Responsibilities", "Compensation & Benefits", "Termination Clause"],
        category: "For Employees",
    },
    {
        title: "5 Clauses to Watch For in a Rental Agreement",
        icon: FileText,
        takeaways: ["Lease Term & Rent", "Security Deposit", "Maintenance & Repairs"],
        category: "For Tenants",
    },
    {
        title: "Decoding the NDA: What Are You Really Signing?",
        icon: Scale,
        takeaways: ["Confidential Information", "Obligations of Receiving Party", "Time Period"],
        category: "For Freelancers",
    },
    {
        title: "Website T&Cs vs. Privacy Policy: What's the Difference?",
        icon: BookOpen,
        takeaways: ["Terms of Service Rules", "Data Privacy & GDPR", "User Rights"],
        category: "For Business",
    },
];

// Displayed by default in the Jargon Buster
const featuredGlossaryTerms = [
    { term: "Liability", definition: "Legal responsibility for one's acts or omissions." },
    { term: "Indemnity", definition: "A promise by one party to cover the losses of another party." },
    { term: "Jurisdiction", definition: "The official power to make legal decisions and judgments over a person, territory, or subject matter." },
    { term: "Tort", definition: "A civil wrong that causes a claimant to suffer loss or harm, resulting in legal liability for the person who commits the tortious act." },
    { term: "Affidavit", definition: "A written statement confirmed by oath or affirmation, for use as evidence in court." },
    { term: "Injunction", definition: "A court order that compels a party to do or refrain from specific acts." },
];


// --- The Main Page Component ---

const ReadersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleJargonSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResult(null);
            return;
        }

        const response = checkJargonMeaning(searchTerm);
        setSearchResult(response);
    };

    return (
        <>
        <Head>
            <title>Legal Knowledge Hub - Legal Lens</title>
            <meta name="description" content="Educate yourself on complex legal topics with articles, templates, and more." />
        </Head>

        {/* Main container with dark background */}
        <div className="min-h-screen bg-black text-gray-200 font-sans">

            <main className="container mx-auto px-4 py-12">
            {/* --- Header and Search --- */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-white mb-4">Legal Knowledge Hub</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Your resource for demystifying legal documents. Explore articles, templates, and definitions.
                </p>
                <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                    <input
                    type="search"
                    placeholder="Search for a topic (e.g., 'NDA', 'lease')..."
                    className="w-full p-4 pr-12 text-lg bg-gray-800 border border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                    />
                    <button className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-blue-600 rounded-full hover:bg-blue-700">
                    <Search className="h-6 w-6 text-white" />
                    </button>
                </div>
                </div>
            </header>

            {/* --- Main Content Grid --- */}
            <h2 className="text-3xl font-bold text-white mb-6">Educational Articles & Guides</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* --- Left Side: Articles --- */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
                    <article.icon className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                    <div className="text-gray-400 text-sm space-y-1">
                    {article.takeaways.map((takeaway, i) => (
                        <p key={i} className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span>{takeaway}</span>
                        </p>
                    ))}
                    </div>
                    <p className="text-xs text-blue-400 mt-4 font-semibold uppercase">{article.category}</p>
                </div>
                ))}
            </div>

            {/* --- Right Side: Sidebar --- */}
            <aside className="space-y-8 flex flex-col">
                {/* Legal Jargon Buster */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-white mb-4">Jargon Buster</h2>
                <div className="space-y-3">
                    {featuredGlossaryTerms.map((item, index) => (
                    <div key={index}>
                        <h4 className="font-semibold text-white">{item.term}</h4>
                        <p className="text-gray-400 text-sm">{item.definition}</p>
                    </div>
                    ))}
                </div>

                {/* --- NEW: Jargon Search Form --- */}
                <form onSubmit={handleJargonSearch} className="mt-6">
                    <label htmlFor="jargon-search" className="sr-only">Search Jargon</label>
                    <div className="relative">
                        <input
                            id="jargon-search"
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Define a legal term..."
                            className="w-full p-3 pr-10 text-sm bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                        />
                        <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </form>

                {/* --- NEW: Search Result Display --- */}
                {searchResult && (
                    <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded-md animate-fade-in">
                            <h4 className="font-semibold text-blue-400">{searchResult.term}</h4>
                            <p className="text-white text-sm">{searchResult.definition}</p>
                    </div>
                )}

                </div>
            </aside>
            </div>

            {/* --- Call to Action Banner --- */}
            <div className="mt-20 text-center p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg">
                <h2 className="text-3xl font-bold text-white">Bring Clarity to Your Own Documents</h2>
                <p className="text-indigo-200 mt-2 mb-6">Ready to move from theory to practice? Upload your document and let Legal Lens do the hard work.</p>
                <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-transform hover:scale-105">
                    Analyze a Document
                </button>
            </div>

            </main>
        </div>
        </>
    );
};

export default ReadersPage;