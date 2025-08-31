import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center bg-black">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 text-center w-250">Clarity in Every Clause.<br/>Confidence in Every Contract.</h1>
      <p className="text-lg text-center md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">Legal Lens uses cutting-edge AI to demystify complex legal documents, provide instant insights, and enhance your legal writing.</p>
      <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl">
        Get Started
      </button>

      <div className="mt-25 w-full pt-4 max-w-4xl p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white">What You'll Get</h2>
        <ul className="mt-4 list-disc list-inside text-white text-xl">
          <li>Easy-to-understand explanations of legal terms and jargon</li>
          <li>Concise summaries of lengthy contracts and documents</li>
          <li>Accurate answers to your specific legal questions</li>
          <li>A reliable legal consultant anytime you need one</li>
        </ul>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">Our Powerful Toolkit</h2>
                  <p className="text-slate-400 mt-2">Everything you need to navigate the legal landscape with confidence.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FeatureCard
                      icon={<FileText className="w-10 h-10 text-cyan-400" />}
                      title="Document Analyzer"
                      description="Upload any legal document to get a simple summary, identify key clauses, and understand complex jargon instantly."
                  />
                  <FeatureCard
                      icon={<MessageCircle className="w-10 h-10 text-cyan-400" />}
                      title="Consultant AI"
                      description="Ask general legal questions and get informative answers from our AI assistant. (Not legal advice)."
                  />
                  <FeatureCard
                      icon={<CheckSquare className="w-10 h-10 text-cyan-400" />}
                      title="AI Proofreading"
                      description="Perfect your legal writing. Our AI proofreader checks for grammar, spelling, and style, ensuring professionalism."
                  />
                  <FeatureCard
                      icon={<BookOpen className="w-10 h-10 text-cyan-400" />}
                      title="Law of the Day"
                      description="Expand your legal knowledge with a fascinating new law, historical case, or legal fact delivered daily."
                  />
              </div>
          </div>
      </section>
    </div>
  );
}