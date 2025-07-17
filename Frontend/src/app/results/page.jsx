
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateStudyTool } from '@/ai/flows/study-tools-flow';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, BrainCircuit, FileQuestion, Copy } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Flashcard Component
const Flashcard = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);
  
    return (
        <div className="perspective-1000 h-96">
            <div 
                className={cn(
                    "relative w-full h-full rounded-xl shadow-lg transition-transform duration-700 transform-style-3d cursor-pointer",
                    isFlipped ? "rotate-y-180" : ""
                )}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-card border flex flex-col items-center justify-center p-6 rounded-xl">
                    <p className="text-muted-foreground text-sm mb-2">Term</p>
                    <h3 className="text-xl md:text-2xl font-semibold text-center">{card.term}</h3>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-secondary rotate-y-180 flex flex-col p-6 rounded-xl overflow-y-auto">
                    <div className='text-left'>
                        <p className="text-secondary-foreground/70 text-sm mb-1 font-semibold">Definition</p>
                        <p className="text-secondary-foreground text-base mb-4">{card.definition}</p>
                    </div>
                    {card.elaboration && (
                        <>
                            <Separator className="bg-secondary-foreground/20 my-2"/>
                            <div className='text-left mt-2'>
                                <p className="text-secondary-foreground/70 text-sm mb-1 font-semibold">Example / Elaboration</p>
                                <p className="text-secondary-foreground text-base">{card.elaboration}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
      </div>
    );
};
  
// Quiz Component
const Quiz = ({ quizData }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
  
    const handleAnswerChange = (questionIndex, answer) => {
      setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };
  
    const handleSubmit = () => {
      setIsSubmitted(true);
    };

    const getScore = () => {
        return quizData.reduce((score, question, index) => {
          return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
        }, 0);
    };

    const copyToClipboard = () => {
        const text = quizData.map((q, i) => {
            return `Question ${i+1}: ${q.question}\nOptions:\n${q.options.join('\n')}\nCorrect Answer: ${q.correctAnswer}\n\n`;
        }).join('');
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Quiz content copied to clipboard." });
    }
  
    return (
        <div className="space-y-8">
            {quizData.map((item, index) => (
                <Card key={index} className={cn(
                    "transition-colors",
                    isSubmitted && (selectedAnswers[index] === item.correctAnswer ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10')
                )}>
                    <CardHeader>
                        <CardTitle>Question {index + 1}</CardTitle>
                        <CardDescription>{item.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            value={selectedAnswers[index]} 
                            onValueChange={(value) => handleAnswerChange(index, value)}
                            disabled={isSubmitted}
                        >
                            {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                                <Label htmlFor={`q${index}-o${optionIndex}`}>{option}</Label>
                            </div>
                            ))}
                        </RadioGroup>
                        {isSubmitted && (
                            <div className="mt-4 p-3 rounded-md bg-muted text-sm">
                                <p><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                                {selectedAnswers[index] !== item.correctAnswer && <p><strong>Your Answer:</strong> {selectedAnswers[index] || "Not answered"}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end gap-4 mt-8">
                {isSubmitted ? (
                    <Card className="p-4 bg-muted">
                        <p className="font-bold text-lg">Your Score: {getScore()} / {quizData.length}</p>
                    </Card>
                ) : (
                    <Button onClick={handleSubmit} size="lg">Submit Quiz</Button>
                )}
                 <Button onClick={copyToClipboard} variant="outline" title="Copy Quiz Text"><Copy className="h-4 w-4"/></Button>
            </div>
        </div>
    );
};

const ResultsContent = () => {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [toolType, setToolType] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This check ensures the code only runs on the client
        if (typeof window === 'undefined') {
            return;
        }

        const type = searchParams.get('type');
        const docText = sessionStorage.getItem('documentTextForTool');
        setToolType(type);

        if (!type || !docText) {
            setError("Missing required information to generate study tools. Please go back and try again.");
            setIsLoading(false);
            return;
        }

        const generate = async () => {
            try {
                const result = await generateStudyTool({ documentText: docText, toolType: type });
                if (type === 'flashcards' && (!result.flashcards || result.flashcards.length === 0)) {
                    throw new Error("The AI couldn't generate flashcards for this document.");
                }
                if (type === 'quiz' && (!result.quiz || result.quiz.length === 0)) {
                    throw new Error("The AI couldn't generate a quiz for this document.");
                }
                setData(result);
            } catch (e) {
                console.error("Error generating study tool:", e);
                setError(e.message || "An unknown error occurred.");
                toast({ variant: "destructive", title: "Generation Failed", description: e.message });
            } finally {
                setIsLoading(false);
                // It's safer to only remove the item if it was successfully used.
                sessionStorage.removeItem('documentTextForTool');
            }
        };

        generate();
    }, [searchParams, toast]);

    const pageTitle = toolType === 'flashcards' ? 'Generated Flashcards' : 'Generated Quiz';
    const pageDescription = toolType === 'flashcards' 
        ? 'Click on a card to flip it and reveal the definition.' 
        : 'Answer the questions below to test your knowledge.';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <BrainCircuit className="w-16 h-16 text-primary animate-pulse mb-4" />
                <h1 className="text-2xl font-bold mb-2">Generating Your Study Materials...</h1>
                <p className="text-muted-foreground">The AI is hard at work. This may take a moment.</p>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mt-6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <FileQuestion className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-destructive">Generation Failed</h1>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 md:px-6 py-10">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">{pageTitle}</h1>
                <p className="text-lg text-muted-foreground mt-2">{pageDescription}</p>
            </header>
            
            <main>
                {toolType === 'flashcards' && data?.flashcards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                       {data.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
                    </div>
                )}
                {toolType === 'quiz' && data?.quiz && <Quiz quizData={data.quiz} />}
            </main>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}

