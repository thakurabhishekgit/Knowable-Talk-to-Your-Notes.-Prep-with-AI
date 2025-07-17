
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export function NewWorkspaceDialog({ children, onWorkspaceCreated }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in to create a workspace." });
        setIsSubmitting(false);
        return;
    }

    const payload = { name, description };

    try {
        await api.post(`/api/workspace/user/${user.id}`, payload);
        toast({ title: "Success", description: "Workspace created successfully." });
        onWorkspaceCreated(); // Callback to refresh the list
        setName('');
        setDescription('');
        setOpen(false); // Close the dialog
    } catch (error) {
        console.error("Failed to create workspace:", error);
        // The api wrapper already shows a toast on error
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
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
                Give your new workspace a name and a short description.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Name
                </Label>
                <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Project Quantum Leap" 
                    className="col-span-3" 
                    required
                />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                Description
                </Label>
                <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary of what this workspace is for."
                className="col-span-3"
                />
            </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Workspace"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
