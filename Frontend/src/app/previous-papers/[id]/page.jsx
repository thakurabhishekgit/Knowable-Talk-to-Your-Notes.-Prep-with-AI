
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, BrainCircuit, Loader2, FileQuestion, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { PreviousPaperDialog } from "@/components/previous-paper-dialog";
import { useToast } from "@/hooks/use-toast";
import { generateAnswers } from "@/ai/flows/question-answer-flow";
import { Skeleton } from "@/components/ui/skeleton";

function AnalysisResultDisplay({ analysisResult }) {
    if (!analysisResult || !analysisResult.results || analysisResult.results.length === 0) {
        return (
            <div className="mt-6 text-center text-muted-foreground">
                <p>The analysis did not return any results.</p>
            </div>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    Analysis Complete
                </CardTitle>
                <CardDescription>
                    Here are the answers to the questions found in the paper, based on your document content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full space-y-4">
                    {analysisResult.results.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg bg-background/50">
                            <AccordionTrigger className="p-4 text-base font-semibold text-left hover:no-underline">
                                 <div className="flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 mt-1 text-primary shrink-0" />
                                    <span>{item.question}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                               <p className="text-sm text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md">{item.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}

function PapersPageSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-10">
            <header className="mb-8">
                <Skeleton className="h-5 w-2/3 mb-4" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-80" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>
            </header>
            <main>
                <div className="space-y-4">
                    {Array.from({length: 2}).map((_, i) => (
                        <Card key={i} className="flex flex-col sm:flex-row items-start justify-between p-4 gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <Skeleton className="h-8 w-8 rounded-md mt-1 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-28" />
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default function PreviousPapersPage() {
    const params = useParams();
    const { toast } = useToast();
    const documentId = params.id;

    const [document, setDocument] = useState(null);
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzedPaperId, setAnalyzedPaperId] = useState(null);

    const fetchDocumentAndPapers = async () => {
        if (documentId) {
            setIsLoading(true);
            try {
                // The workspaceId is needed for fetching the document context correctly.
                const workspaceId = sessionStorage.getItem('workspaceIdForReport');
                if (!workspaceId) {
                    throw new Error("Workspace context is missing. Please navigate from the workspace page.");
                }

                const docData = await api.get(`/api/documents/workspace/${workspaceId}/document/${documentId}`);
                setDocument(docData);
                
                // Fetch papers only after document is successfully fetched.
                const papersData = await api.get(`/api/previous-papers/document/${documentId}`);
                setPapers(papersData || []);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast({ variant: "destructive", title: "Error", description: error.message || "Could not load document or papers." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchDocumentAndPapers();
    }, [documentId]);
    
    const handlePaperUploaded = () => {
        fetchDocumentAndPapers();
    };

    const handleAnalyze = async (paper) => {
        if (!document?.textExtracted) {
            toast({ variant: "destructive", title: "Analysis Error", description: "The main document text is not available." });
            return;
        }
        if (!paper.textExtracted) {
            toast({ variant: "destructive", title: "Analysis Error", description: "Text could not be extracted from the question paper." });
            return;
        }
        
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalyzedPaperId(paper.id);

        try {
            // Simple heuristic to extract questions: find lines ending with a question mark.
            const questions = paper.textExtracted.split('\n').filter(line => line.trim().endsWith('?'));

            if (questions.length === 0) {
                 toast({ variant: "destructive", title: "No Questions Found", description: "Could not automatically identify questions in the paper." });
                 setIsAnalyzing(false); // Stop analyzing if no questions found
                 return;
            }

            const result = await generateAnswers({
                documentText: document.textExtracted,
                questions: questions
            });

            setAnalysisResult(result);

        } catch (error) {
            console.error("Analysis failed", error);
            toast({ variant: "destructive", title: "Analysis Failed", description: error.message });
        } finally {
            setIsAnalyzing(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) {
        return <PapersPageSkeleton />;
    }

    if (!document) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold">Document not found.</h1>
            </div>
        )
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
                        <BreadcrumbLink href={`/workspace/${document.workspace?.id}`}>
                            {document.workspace?.name || 'Workspace'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                     <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbLink href={`/document/${document.id}?workspaceId=${document.workspace?.id}`}>
                            {document.title}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Previous Papers</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Previous Paper Analysis</h1>
                        <p className="text-lg text-muted-foreground mt-1">
                            Analyze past papers for "{document.title}"
                        </p>
                    </div>
                    <PreviousPaperDialog document={document} onPaperUploaded={handlePaperUploaded}>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Paper
                        </Button>
                    </PreviousPaperDialog>
                </div>
            </header>

            <main>
                {papers.length > 0 ? (
                    <div className="space-y-4">
                        {papers.map((paper) => (
                            <Card key={paper.id} className="flex flex-col sm:flex-row items-start justify-between p-4 gap-4">
                                <div className="flex items-start gap-4">
                                    <FileQuestion className="h-8 w-8 text-primary mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">{paper.subjectName}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Uploaded on {formatDate(paper.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleAnalyze(paper)}
                                    disabled={isAnalyzing}
                                    className="w-full sm:w-auto shrink-0"
                                >
                                    {isAnalyzing && analyzedPaperId === paper.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Analyze"
                                    )}
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border rounded-lg bg-card">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Question Papers Uploaded</h3>
                        <p className="text-muted-foreground mt-2">
                            Upload a previous year's paper to get started.
                        </p>
                    </div>
                )}
                
                {analysisResult && <AnalysisResultDisplay analysisResult={analysisResult} />}
            </main>
        </div>
    );
}
