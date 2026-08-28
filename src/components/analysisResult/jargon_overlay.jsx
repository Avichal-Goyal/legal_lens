import { X } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Card } from "../ui/card"

export default function JargonOverlay ({jargons}) {
    return (
        <div className="absolute inset-0 z-50 bg-neutral-50/95 backdrop-blur-md pd-8 flex flex-col px-10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Legal Jargons</h2>
            {/* <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                <X />
            </button> */}
        </div>

        <ScrollArea className="flex-1 h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
                {jargons.map((item, index) => (
                    <Card key={index} className="p-5 border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.term}</h3>
                        <p className="text-neutral-600 leading-relaxed text-sm">{item.definition}</p>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </div>
    )
    
}