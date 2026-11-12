export default function JargonOverlay({ jargons = [] }) {
    return (
        <section>
            <div className="border-b border-[#DFD5BE] px-8 py-6">
                <h2 className="ll-font-display text-2xl text-[#201C15]">Legal jargons</h2>
                <p className="mt-1 text-sm text-[#6B6152]">
                    {jargons.length > 0
                        ? `${jargons.length} terms from this document, explained in plain English.`
                        : "Terms from this document, explained in plain English."}
                </p>
            </div>

            <div className="px-8 py-7">
                {jargons.length > 0 ? (
                    <dl className="divide-y divide-[#DFD5BE] border-y border-[#DFD5BE]">
                        {jargons.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                                <dt className="ll-font-display text-lg leading-snug text-[#8B6528]">{item.term}</dt>
                                <dd className="text-[15px] leading-7 text-[#3A3527]">{item.definition}</dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <p className="text-sm text-[#6B6152]">No legal terms were flagged in this document.</p>
                )}
            </div>
        </section>
    );
}