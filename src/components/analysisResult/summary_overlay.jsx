import ReactMarkdown from "react-markdown";

// Styled elements so the markdown matches the brand without relying on the typography plugin
const markdownComponents = {
    p: (props) => <p className="text-[15px] leading-7 text-[#3A3527] mb-4 last:mb-0" {...props} />,
    ul: (props) => <ul className="space-y-3 mb-4 last:mb-0" {...props} />,
    ol: (props) => <ol className="list-decimal pl-5 space-y-3 mb-4 last:mb-0 marker:text-[#8B6528]" {...props} />,
    li: (props) => (
        <li className="relative pl-5 text-[15px] leading-7 text-[#3A3527] before:absolute before:left-0 before:top-[0.8em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#C6A15B]" {...props} />
    ),
    strong: (props) => <strong className="font-semibold text-[#201C15]" {...props} />,
    h1: (props) => <h3 className="ll-font-display text-xl text-[#201C15] mt-6 mb-3" {...props} />,
    h2: (props) => <h3 className="ll-font-display text-lg text-[#201C15] mt-6 mb-3" {...props} />,
    h3: (props) => <h4 className="ll-font-display text-base text-[#201C15] mt-5 mb-2" {...props} />,
    a: (props) => <a className="text-[#8B6528] underline underline-offset-4" {...props} />,
};

export default function SummaryOverlay({ summary }) {
    let displayData = "";

    if (summary && typeof summary === "object") {
        displayData = summary.content || summary.summary || summary.text || JSON.stringify(summary);
    } else {
        displayData = summary ? String(summary) : "";
    }

    return (
        <section>
            <div className="border-b border-[#DFD5BE] px-8 py-6">
                <h2 className="ll-font-display text-2xl text-[#201C15]">Document summary</h2>
                <p className="mt-1 text-sm text-[#6B6152]">Written by Legal Lens from the full text of your document.</p>
            </div>

            <div className="px-8 py-7">
                {displayData ? (
                    <div className="max-w-2xl">
                        <ReactMarkdown components={markdownComponents}>{displayData}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-sm text-[#6B6152]">No summary was generated for this document. Try uploading it again.</p>
                )}
            </div>
        </section>
    );
}