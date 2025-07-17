
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, FileQuestion, GraduationCap, FileClock, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function StudyToolsPanel({ document }) {
    const router = useRouter();
    const { toast } = useToast();

    const handleGenerateStudyTool = (toolType) => {
        if (!document?.textExtracted) {
            toast({
                variant: "destructive",
                title: "Cannot Generate",
                description: "The text for this document has not been processed yet. Please wait a moment and try again."
            });
            return;
        }

        try {
            sessionStorage.setItem('documentTextForTool', document.textExtracted);
            router.push(`/results?type=${toolType}`);
        } catch (error) {
            console.error("Failed to use sessionStorage or navigate:", error);
            toast({
                variant: "destructive",
                title: "Navigation Error",
                description: "Could not navigate to the results page. Your browser may not support session storage or it is full."
            });
        }
    };
    
    const handleGenerateReport = (reportType) => {
        if (!document?.textExtracted) {
            toast({
                variant: "destructive",
                title: "Cannot Generate Report",
                description: "The text for this document has not been processed yet. Please wait a moment and try again."
            });
            return;
        }

        try {
            sessionStorage.setItem('documentTextForTool', document.textExtracted);
            sessionStorage.setItem('documentTitle', document.title);
            sessionStorage.setItem('workspaceIdForReport', document.workspace.id);
            router.push(`/${reportType}/${document.id}?workspaceId=${document.workspace.id}`);
        } catch (error) {
             console.error("Failed to use sessionStorage or navigate:", error);
             toast({
                variant: "destructive",
                title: "Navigation Error",
                description: "Could not navigate to the report page."
            });
        }
    };


    const handleAnalyzePaperClick = () => {
        if (document?.workspace?.id) {
            sessionStorage.setItem('workspaceIdForReport', document.workspace.id);
            router.push(`/previous-papers/${document.id}`);
        } else {
            toast({
                variant: "destructive",
                title: "Navigation Error",
                description: "Cannot navigate. The workspace context for this document is missing.",
            });
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">
            <div className="text-center">
                <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">AI Study Tools</h3>
                <p className="text-sm text-muted-foreground">
                    Generate helpful materials from your document with one click.
                </p>
            </div>
            
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Layers className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Generate Flashcards</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Automatically create flashcards for key terms and concepts in the document.
                        </CardDescription>
                        <Button className="mt-4 w-full" onClick={() => handleGenerateStudyTool('flashcards')}>
                            Create Flashcards
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <FileQuestion className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Generate Quiz</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Create a multiple-choice quiz to test your understanding of the material.
                        </CardDescription>
                        <Button className="mt-4 w-full" onClick={() => handleGenerateStudyTool('quiz')}>
                            Create a Quiz
                        </Button>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <Search className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Find Key Topics & Questions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                           Let AI find the main topics, key terms, and potential questions from your document.
                        </CardDescription>
                        <Button onClick={() => handleGenerateReport('topics-report')} className="mt-4 w-full">
                            Generate Study Guide
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <FileClock className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Analyze Previous Papers</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                           Upload and analyze past papers to find important topics and expected questions.
                        </CardDescription>
                        <Button onClick={handleAnalyzePaperClick} className="mt-4 w-full">
                            Manage & Analyze Papers
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
