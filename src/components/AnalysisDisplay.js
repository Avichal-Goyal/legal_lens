import React from 'react';

// Simple icons for visual flair
const IconSummary = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconClause = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3m-3 5h6" /></svg>;
const IconJargon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const AnalysisDisplay = ({ analysis }) => {
    if (!analysis) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Analysis Result</h1>
                <p className="text-gray-600 text-center">No analysis data found.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
                Document Analysis
            </h1>

            {/* Summary Section */}
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
                <h2 className="flex items-center text-xl font-semibold text-blue-800 mb-3">
                    <IconSummary />
                    Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {analysis.summary}
                </p>
            </div>

            {/* Key Clauses Section */}
            <div className="p-5 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="flex items-center text-xl font-semibold text-green-800 mb-4">
                <IconClause />
                    Key Clauses
                </h2>
                <div className="space-y-4">
                    {analysis.keyClauses?.map((clause, index) => (
                        <div key={index} className="border-t border-green-200 pt-3">
                            <h3 className="font-semibold text-gray-800">{clause.title}</h3>
                            <p className="text-gray-600 mt-1">{clause.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jargon Buster Section */}
            <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h2 className="flex items-center text-xl font-semibold text-purple-800 mb-4">
                    <IconJargon />
                    Jargon Buster
                </h2>
                <dl className="space-y-4">
                    {analysis.jargonBuster?.map((jargon, index) => (
                        <div key={index} className="border-t border-purple-200 pt-3">
                            <dt className="font-semibold text-gray-800">{jargon.term}</dt>
                            <dd className="text-gray-600 mt-1">{jargon.definition}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default AnalysisDisplay;