
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileText } from "lucide-react";
import { api } from "@/lib/api";
import { ChatPanel } from "@/components/chat-panel";
import { Skeleton } from "@/components/ui/skeleton";

function DocumentPageSkeleton() {
    return (
        <div className="flex flex-col h-full">
            <header className="container mx-auto px-4 md:px-6 py-4 border-b">
                <Skeleton className="h-5 w-1/3 mb-4" />
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
            </header>
             <main className="container mx-auto p-4 md:p-6 flex-1">
                 <div className="h-[100vh]">
                    <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg border">
                        <ResizablePanel defaultSize={65} minSize={30}>
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Skeleton className="h-full w-full" />
                            </div>
                        </ResizablePanel>
                         <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={35} minSize={30}>
                            <div className="h-full flex flex-col">
                                <div className="p-2 border-b">
                                     <Skeleton className="h-9 w-full" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col items-center justify-center gap-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                 </div>
             </main>
        </div>
    )
}


export default function SingleDocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const documentId = params.id;
  const workspaceId = searchParams.get('workspaceId');
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (workspaceId && documentId) {
        try {
          setLoading(true);
          const docData = await api.get(`/api/documents/workspace/${workspaceId}/document/${documentId}`);
          setDocument(docData);
        } catch (error) {
          console.error("Failed to fetch document", error);
          setDocument(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [workspaceId, documentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <DocumentPageSkeleton />;
  }

  if (!document) {
    return (
      <div className="container mx-auto p-8">
        Document not found. It may have been deleted or the link is incorrect.
      </div>
    );
  }

  const documentViewerUrl = document.fileUrl ? `https://docs.google.com/gview?url=${encodeURIComponent(document.fileUrl)}&embedded=true` : '';

  return (
    <div className="flex flex-col h-full">
        <header className="container mx-auto px-4 md:px-6 py-4 border-b">
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {workspaceId ? (
                    <BreadcrumbLink href={`/workspace/${workspaceId}`}>
                        {document.workspace?.name || 'Workspace'}
                    </BreadcrumbLink>
                    ) : (
                    <BreadcrumbPage>Workspace</BreadcrumbPage>
                    )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{document.title}</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold mt-2 flex items-center gap-3 truncate">
                <FileText className="h-6 w-6 text-primary shrink-0" />
                <span className="truncate">{document.title}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
                Type: {document.fileType} | Uploaded: {formatDate(document.uploadedAt)}
            </p>
        </header>

        <main className="container mx-auto p-4 md:p-6 flex-1">
            <div className="h-[100vh]">
              <ResizablePanelGroup
                direction="horizontal"
                className="w-full h-full rounded-lg border"
              >
                <ResizablePanel defaultSize={65} minSize={30}>
                  {documentViewerUrl ? (
                      <iframe
                          src={documentViewerUrl}
                          className="w-full h-full"
                          title={document.title}
                      ></iframe>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                          <p className="text-muted-foreground">Document preview is not available.</p>
                      </div>
                  )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={30}>
                    <div className="h-full">
                        <ChatPanel document={document} />
                    </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
        </main>
    </div>
  );
}
