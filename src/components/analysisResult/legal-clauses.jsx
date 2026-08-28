import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function LegalClauses({clauses}) {

    return (
        <div className="absolute inset-0 z-50 bg-neutral-50/98 backdrop-blur-md flex flex-col pt-8 px-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 font-sans">Extracted Clauses</h2>
                {/* <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-all">✕</button> */}
            </div>

            <ScrollArea className="flex-1 h-[500px]">
                    <div className="max-w-3xl mx-auto space-y-6 pb-12">
                    {clauses.map((clause, i) => (
                        <Card key={i} className="p-6 border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors">
                            <h3 className="text-lg font-bold text-neutral-900 mb-3">{clause.title}</h3>
                            {/* <div className="pl-4 border-l-2 border-neutral-200 mb-4 italic text-neutral-600 text-sm">
                                "{clause.explanation}"
                            </div> */}

                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                <p className="text-xs font-bold uppercase text-neutral-400 mb-1">AI Insight</p>
                                <p className="text-sm text-neutral-800 leading-relaxed">{clause.explanation}</p>
                            </div>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>

            
        </div>
    );
}