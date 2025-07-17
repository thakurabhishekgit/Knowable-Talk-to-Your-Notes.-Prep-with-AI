
"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
import { FileClock, Lightbulb, HelpCircle, BookCheck } from "lucide-react";

export default function AnalysisReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [analysis, setAnalysis] = useState(null);
    const [documentTitle, setDocumentTitle] = useState('Document');
    const [error, setError] = useState(null);
    const [noOverlap, setNoOverlap] = useState(false);
    
    // Read workspaceId from URL and store it for consistent navigation
    useEffect(() => {
        const workspaceId = searchParams.get('workspaceId');
        if (workspaceId) {
            sessionStorage.setItem('workspaceIdForReport', workspaceId);
        }
    }, [searchParams]);

    useEffect(() => {
        try {
            const resultString = sessionStorage.getItem('paperAnalysisResult');
            const docTitle = sessionStorage.getItem('documentTitle');
            if (docTitle) {
                setDocumentTitle(docTitle);
            }
            if (resultString) {
                const parsedResult = JSON.parse(resultString);
                if (parsedResult.analysis && parsedResult.analysis.length > 0) {
                    setAnalysis(parsedResult);
                } else {
                    // This is the specific case where the AI ran but found nothing.
                    setNoOverlap(true);
                }
                sessionStorage.removeItem('paperAnalysisResult');
                sessionStorage.removeItem('documentTitle');
            } else {
                setError("No analysis data found. Please go back and generate a new report.");
            }
        } catch (e) {
            console.error("Failed to load analysis report:", e);
            setError("There was an error loading the report data.");
        }
    }, []);

    if (error) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-10 text-center">
                <FileClock className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-destructive">Could Not Load Report</h1>
                <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
                <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
            </div>
        );
    }

    if (noOverlap) {
        return (
             <div className="container mx-auto px-4 md:px-6 py-10 text-center">
                <FileClock className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">No Overlapping Topics Found</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    The AI could not generate an analysis. This usually happens when there is no significant overlap between the topics in your study material ("{documentTitle}") and the uploaded question paper.
                </p>
                <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
            </div>
        )
    }
    
    if (!analysis) {
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
                        <BreadcrumbPage>Analysis Report</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Previous Paper Analysis</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Important topics and questions based on your uploaded paper for "{documentTitle}".
                    </p>
                </div>
            </header>

            <main>
                <Accordion type="multiple" defaultValue={analysis.analysis.map(a => a.topic)} className="w-full space-y-4">
                    {analysis.analysis.map((item) => (
                        <AccordionItem value={item.topic} key={item.topic} className="border rounded-lg bg-card">
                            <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="w-6 h-6 text-primary" />
                                    <span>{item.topic}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                               <p className="text-sm text-muted-foreground italic mb-6">{item.reason}</p>
                               
                               <div className="grid md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <HelpCircle className="w-5 h-5"/>
                                                Expected Questions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                                {item.expectedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                     <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <BookCheck className="w-5 h-5"/>
                                                Last-Minute Revision
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3 text-sm">
                                                {item.revisionNotes.map((note, i) => (
                                                    <li key={i}>
                                                        <p className="font-semibold">{note.point}</p>
                                                        <p className="text-muted-foreground pl-2">{note.details}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
        </div>
    );
}
