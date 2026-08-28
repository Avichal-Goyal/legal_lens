import { ScrollArea } from "../ui/scroll-area";

export default function DocumentViewer() {
    return (
        <div className="relative h-full w-full bg-neutral-100 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto my-8 p-12 bg-white shadow-sm border border-neutral-200 min-h-[1100px]">

                    <div className="border-b-2 border-neutral-900 pb-4 mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
                            Service Agreement
                        </h2>
                        <p className="text-2xl font-serif text-neutral-900 mt-2">
                            Software Development & Consulting Contract
                        </p>

                    </div>

                    <div className="space-y-6 text-neutral-800 font-serif leading-relaxed">
                        <p>
                            This agreement is made between <span className="bg-yellow-100 px-1">Legal Lens AI</span> and the Client as of February 2026...
                        </p>

                        <h3 className="font-sans font-bold text-lg text-neutral-900 mt-8">
                            1. Scope of Work

                        </h3>
                        <p>
                            The Consultant shall provide machine learning analysis and data mining 
                            services as specified in the project roadmap...
                        </p>

                    </div>

                </div>
            </ScrollArea>

        </div>
    );
}