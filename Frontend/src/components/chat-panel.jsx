
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, ScanText, FileText as FileTextIcon, GraduationCap } from 'lucide-react';
import { DocumentChat } from '@/components/document-chat';
import { TextAnalyzerPanel } from '@/components/text-analyzer-panel';
import { DocumentTextViewer } from '@/components/document-text-viewer';
import { StudyToolsPanel } from '@/components/study-tools-panel';

export function ChatPanel({ document }) {
  
  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
            <CardHeader className="p-2 border-b">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="chat">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                    </TabsTrigger>
                     <TabsTrigger value="tools">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Tools
                    </TabsTrigger>
                    <TabsTrigger value="analyze">
                        <ScanText className="w-4 h-4 mr-2" />
                        Analyze
                    </TabsTrigger>
                    <TabsTrigger value="text">
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        Text
                    </TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="chat" className="flex-1 overflow-auto mt-0">
               <DocumentChat document={document} />
            </TabsContent>
            <TabsContent value="tools" className="flex-1 overflow-auto mt-0">
                <StudyToolsPanel document={document} />
            </TabsContent>
            <TabsContent value="analyze" className="flex-1 overflow-auto mt-0">
                <TextAnalyzerPanel document={document} />
            </TabsContent>
            <TabsContent value="text" className="flex-1 overflow-auto mt-0">
                <DocumentTextViewer document={document} />
            </TabsContent>
        </Tabs>
    </Card>
  );
}
