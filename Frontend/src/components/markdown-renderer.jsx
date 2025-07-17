
"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const CodeBlock = ({ language, value }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-md bg-[#1e1e1e] overflow-hidden border border-muted">
            <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
                <span>{language || 'code'}</span>
                <button onClick={handleCopy} className="flex items-center gap-1">
                    {hasCopied ? <Check size={14} /> : <Copy size={14} />}
                    {hasCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem' }}
                codeTagProps={{ style: { fontFamily: 'var(--font-code)' } }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export function MarkdownRenderer({ content }) {
    const parts = content.split(/(\`\`\`[\w\s]*\n[\s\S]*?\n\`\`\`)/g);

    return (
        <div className="text-sm md:text-base whitespace-pre-wrap">
            {parts.map((part, index) => {
                const codeBlockMatch = part.match(/\`\`\`(\w*)\n([\s\S]*)\n\`\`\`/);
                if (codeBlockMatch) {
                    const language = codeBlockMatch[1] || '';
                    const code = codeBlockMatch[2];
                    return <CodeBlock key={index} language={language} value={code} />;
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
}
