
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export function DocumentTextViewer({ document }) {
    
    const textToShow = document?.textExtracted 
        ? document.textExtracted 
        : "Text has not been extracted from this document yet, or the document contains no text.";

    return (
        <div className="h-full flex flex-col p-2 md:p-4 gap-4">
            <Textarea
                readOnly
                value={textToShow}
                className="flex-grow text-sm h-full resize-none"
                placeholder="Document text will appear here..."
            />
        </div>
    );
}
