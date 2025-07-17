
"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookText, GraduationCap, HelpCircle, FileQuestion, Loader2 } from "lucide-react";
import { generateTopics } from '@/ai/flows/topic-generator-flow';
import { Separator } from '@/components/ui/separator';

export default function TopicsReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [report, setReport] = useState(null);
    const [documentTitle, setDocumentTitle] = useState('Document');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const workspaceId = searchParams.get('workspaceId');
        if (workspaceId) {
            sessionStorage.setItem('workspaceIdForReport', workspaceId);
        }

        const docText = sessionStorage.getItem('documentTextForTool');
        const docTitle = sessionStorage.getItem('documentTitle');
        
        if (docTitle) setDocumentTitle(docTitle);

        if (!docText) {
            setError("Document content not found. Please go back and try again.");
            setIsLoading(false);
            return;
        }

        const generateReport = async () => {
            try {
                const result = await generateTopics({ documentText: docText });
                if (!result.mainTopics?.length && !result.keyTerms?.length && !result.potentialQuestions?.length) {
                    setError("The AI could not generate a report for this document. The content may be too short or not suitable for analysis.");
                } else {
                    setReport(result);
                }
            } catch (e) {
                console.error("Failed to generate topics report:", e);
                setError(e.message || "An unexpected error occurred while generating the report.");
            } finally {
                setIsLoading(false);
                sessionStorage.removeItem('documentTextForTool');
                sessionStorage.removeItem('documentTitle');
            }
        };

        generateReport();
    }, [params.id, searchParams]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <BrainCircuit className="w-16 h-16 text-primary animate-pulse mb-4" />
                <h1 className="text-2xl font-bold mb-2">Analyzing Your Document...</h1>
                <p className="text-muted-foreground">The AI is identifying key topics and questions. This can take a moment.</p>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mt-6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <FileQuestion className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-destructive">Could Not Generate Report</h1>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
            </div>
        );
    }
    
    if (!report) {
        return (
            <div className="container mx-auto p-8">Loading analysis report...</div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-10">
            <header className="mb-8">
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/document/${params.id}?workspaceId=${sessionStorage.getItem('workspaceIdForReport')}`}>
                            {documentTitle}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Key Topics Report</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">AI-Generated Study Guide</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Key topics, terms, and questions for "{documentTitle}".
                    </p>
                </div>
            </header>

            <main className="space-y-12">
                {report.mainTopics && report.mainTopics.length > 0 && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <GraduationCap className="w-8 h-8 text-primary" />
                                Main Topics
                            </CardTitle>
                             <CardDescription>The core concepts discussed in your document.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {report.mainTopics.map((item, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-lg">{item.topic}</h3>
                                    <p className="text-muted-foreground mt-1">{item.summary}</p>
                                    {index < report.mainTopics.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {report.keyTerms && report.keyTerms.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <BookText className="w-8 h-8 text-primary" />
                                Key Terms & Definitions
                            </CardTitle>
                             <CardDescription>A quick glossary of important vocabulary.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {report.keyTerms.map((item, index) => (
                                <div key={index}>
                                    <p><span className="font-semibold">{item.term}:</span> {item.definition}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
                
                {report.potentialQuestions && report.potentialQuestions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <HelpCircle className="w-8 h-8 text-primary" />
                                Potential Exam Questions
                            </CardTitle>
                             <CardDescription>Test your knowledge with these AI-generated questions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc pl-5 space-y-2">
                                {report.potentialQuestions.map((q, i) => <li key={i}>{q}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
