
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export function NewItemDialog({ children, workspaceId, onItemCreated }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
        toast({ variant: "destructive", title: "Missing fields", description: "Please provide a title and select a file."});
        return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
        await api.post(`/api/documents/workspace/${workspaceId}`, formData);
        toast({ title: "Success", description: "Document uploaded successfully." });
        onItemCreated(); // Callback to refresh the list
        
        // Reset form and close dialog
        setTitle('');
        setFile(null);
        document.getElementById('file-input').value = ''; // Clear file input
        setOpen(false);
    } catch (error) {
        console.error("Failed to upload document:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
            <DialogDescription>
                Add a new document to your workspace. Accepted formats: PDF, PPTX, DOCX.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                    Title
                    </Label>
                    <Input 
                        id="title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Project Proposal" 
                        className="col-span-3" 
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file-input" className="text-right">
                    File
                    </Label>
                    <Input 
                        id="file-input" 
                        type="file"
                        onChange={handleFileChange}
                        className="col-span-3" 
                        accept=".pdf,.pptx,.docx"
                        required
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Create Item"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
