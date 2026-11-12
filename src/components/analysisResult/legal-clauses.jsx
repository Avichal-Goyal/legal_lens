export default function LegalClauses({ clauses = [] }) {
    return (
        <section>
            <div className="border-b border-[#DFD5BE] px-8 py-6">
                <h2 className="ll-font-display text-2xl text-[#201C15]">Extracted clauses</h2>
                <p className="mt-1 text-sm text-[#6B6152]">
                    {clauses.length > 0
                        ? `${clauses.length} clauses worth a closer read.`
                        : "Clauses worth a closer read."}
                </p>
            </div>

            <div className="px-8 py-7">
                {clauses.length > 0 ? (
                    <div className="space-y-5">
                        {clauses.map((clause, i) => (
                            <article key={i} className="rounded-md border border-[#DFD5BE] bg-white overflow-hidden">
                                <h3 className="ll-font-display text-lg text-[#201C15] px-5 pt-5 pb-3">{clause.title}</h3>
                                <div className="border-t border-[#DFD5BE] bg-[#F3EDDD] px-5 py-4">
                                    <p className="text-xs font-medium text-[#8B6528] mb-1.5">Legal Lens insight</p>
                                    <p className="text-sm leading-relaxed text-[#3A3527]">{clause.explanation}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-[#6B6152]">No key clauses were extracted from this document.</p>
                )}
            </div>
        </section>
    );
}