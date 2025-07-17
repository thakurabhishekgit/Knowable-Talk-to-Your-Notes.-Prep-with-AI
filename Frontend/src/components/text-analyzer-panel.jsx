
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookText, Lightbulb, Languages, Sparkles, ChevronDown, Repeat } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyzeText } from '@/ai/flows/text-analyzer-flow';
import { useToast } from '@/hooks/use-toast';

const analysisPrompts = [
    { text: "Summarize this text", icon: BookText, task: "Summarize" },
    { text: "Explain this concept", icon: Lightbulb, task: "Explain" },
];

const popularLanguages = ["Hindi", "Telugu", "Spanish", "French"];

export function TextAnalyzerPanel({ document }) {
    const { toast } = useToast();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Hindi');
    const [customLanguage, setCustomLanguage] = useState('');

    const handleAnalysis = async (task, options = {}) => {
        if (!inputText.trim()) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please paste the text you want to analyze.",
            });
            return;
        }

        setIsLoading(true);
        setAnalysisResult('');
        
        let finalTask = task;
        if (task === 'Translate') {
            finalTask = `Translate to ${options.language}`;
        }


        try {
            const result = await analyzeText({ text: inputText, task: finalTask });
            setAnalysisResult(result);
        } catch (error) {
            console.error("Failed to analyze text:", error);
            const errorMessage = error.message.includes("overloaded")
                ? "The AI service is currently overloaded. Please try again."
                : "An error occurred during analysis.";
            toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = () => {
        const lang = customLanguage.trim() || targetLanguage;
        handleAnalysis('Translate', { language: lang });
    };

    return (
        <div className="h-full flex flex-col p-2 md:p-4 gap-4">
            <Textarea
                placeholder="Copy text from the 'Text' tab and paste it here to analyze..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow text-sm min-h-[120px] resize-y"
                disabled={isLoading}
            />
            
            <div className="flex flex-wrap items-center gap-2">
                {analysisPrompts.map((prompt) => (
                    <Button
                        key={prompt.text}
                        variant="outline"
                        onClick={() => handleAnalysis(prompt.task)}
                        disabled={isLoading || !inputText.trim()}
                        size="sm"
                    >
                        <prompt.icon className="w-4 h-4 mr-2" />
                        {prompt.text}
                    </Button>
                ))}
                 <Button
                    variant="outline"
                    onClick={() => handleAnalysis("Transliterate to Hinglish")}
                    disabled={isLoading || !inputText.trim()}
                    size="sm"
                >
                    <Repeat className="w-4 h-4 mr-2" />
                    Transliterate
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="min-w-[120px]" disabled={isLoading || !inputText.trim()}>
                            Translate to: {customLanguage || targetLanguage}
                            <ChevronDown className="w-4 h-4 ml-auto" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {popularLanguages.map(lang => (
                            <DropdownMenuItem key={lang} onSelect={() => { setTargetLanguage(lang); setCustomLanguage(''); }}>
                                {lang}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input 
                    placeholder="Or type a language..."
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    className="h-9 text-sm flex-1 min-w-[150px]"
                    disabled={isLoading || !inputText.trim()}
                />
                 <Button
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim() || !(customLanguage || targetLanguage)}
                    size="icon"
                    variant="outline"
                >
                    <Languages className="w-4 h-4" />
                    <span className="sr-only">Translate</span>
                </Button>
            </div>
            
            <div className="flex-1 min-h-0">
                <Card className="h-full flex flex-col">
                    <CardHeader className="p-3 border-b">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Analysis Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <ScrollArea className="h-full">
                            <div className="p-4 text-sm whitespace-pre-wrap">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-muted-foreground">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <p>Analyzing...</p>
                                        </div>
                                    </div>
                                ) : analysisResult ? (
                                    analysisResult
                                ) : (
                                    <p className="text-muted-foreground text-center pt-8">
                                        Paste text above and choose an action. The result will appear here.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
