
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

export function PreviousPaperDialog({ children, document, onPaperUploaded }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
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
    if (!file || !subjectName || !document?.id) {
        toast({ variant: "destructive", title: "Missing fields", description: "Please provide a subject name and select a file."});
        return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('subjectName', subjectName);
    formData.append('file', file);

    try {
        await api.post(`/api/previous-papers/upload/${document.id}`, formData);
        
        toast({ title: "Upload Complete!", description: "The paper has been added to your list." });
        
        if (onPaperUploaded) {
            onPaperUploaded();
        }

        // Reset form and close dialog
        setSubjectName('');
        setFile(null);
        if (window.document.getElementById('paper-file-input')) {
            window.document.getElementById('paper-file-input').value = '';
        }
        setOpen(false);
    } catch (error) {
        console.error("Failed to upload previous paper:", error);
        toast({ variant: "destructive", title: "Upload Failed", description: error.message || "An unknown error occurred."});
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
            <DialogTitle>Upload Previous Year's Paper</DialogTitle>
            <DialogDescription>
                Upload a past question paper (.pdf, .docx). It will be added to the list for analysis.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjectName" className="text-right">
                    Subject
                    </Label>
                    <Input 
                        id="subjectName" 
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        placeholder="e.g. Python Programming" 
                        className="col-span-3" 
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paper-file-input" className="text-right">
                    Paper File
                    </Label>
                    <Input 
                        id="paper-file-input" 
                        type="file"
                        onChange={handleFileChange}
                        className="col-span-3" 
                        accept=".pdf,.docx"
                        required
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Upload Paper"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
