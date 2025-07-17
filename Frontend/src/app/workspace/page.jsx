
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PlusCircle,
  Clock,
  Trash2,
  Edit,
  Folder,
  MoreVertical,
} from "lucide-react";
import { NewWorkspaceDialog } from "@/components/new-workspace-dialog";
import { VersionHistorySheet } from "@/components/version-history-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function ItemActions({ item, userId, onWorkspaceDeleted }) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!userId || !item.id) {
            toast({ variant: "destructive", title: "Error", description: "Cannot delete workspace. User or Workspace ID is missing." });
            return;
        }
        setIsDeleting(true);
        try {
            await api.delete(`/api/workspace/user/${userId}/workspace/${item.id}`);
            toast({ title: "Success", description: "Workspace deleted successfully." });
            if (onWorkspaceDeleted) {
                onWorkspaceDeleted();
            }
        } catch (error) {
            console.error("Failed to delete workspace:", error);
            // Toast is already handled by the API wrapper
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <VersionHistorySheet item={item}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Version History</span>
                    </DropdownMenuItem>
                </VersionHistorySheet>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            workspace and all its contents.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function WorkspaceTableSkeleton() {
    return (
        <div className="hidden md:block border rounded-lg shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function WorkspaceCardSkeleton() {
    return (
        <div className="md:hidden grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function WorkspacePage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.id) {
          fetchWorkspaces(parsedUser.id);
        }
      }
      setIsCheckingAuth(false);
    }
  }, [router]);

  const fetchWorkspaces = async (userId) => {
    try {
        setLoading(true);
        const fetchedWorkspaces = await api.get(`/api/workspace/user/${userId}`);
        setWorkspaces(fetchedWorkspaces);
    } catch (error) {
        console.error("Failed to fetch workspaces", error);
    } finally {
        setLoading(false);
    }
  }

  const handleWorkspaceAction = () => {
    if (user?.id) {
        fetchWorkspaces(user.id);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  if (isCheckingAuth) {
    return null; // Don't show anything while checking auth
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">Manage all your knowledge workspaces.</p>
        </div>
        <NewWorkspaceDialog onWorkspaceCreated={handleWorkspaceAction}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Workspace</span>
            <span className="inline sm:hidden">New</span>
          </Button>
        </NewWorkspaceDialog>
      </div>

      {loading ? (
        <>
            <WorkspaceTableSkeleton />
            <WorkspaceCardSkeleton />
        </>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
            <h3 className="text-xl font-semibold">No workspaces yet</h3>
            <p className="text-muted-foreground mt-2">Get started by creating a new workspace.</p>
        </div>
      ) : (
        <>
            {/* Desktop View - Table */}
            <div className="hidden md:block border rounded-lg shadow-sm">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workspaces.map((workspace) => (
                    <TableRow key={workspace.id}>
                        <TableCell className="font-medium">
                        <Link href={`/workspace/${workspace.id}`} className="hover:underline">
                            <div className="flex items-center gap-3">
                                <Folder className="h-5 w-5 text-muted-foreground" />
                                <span>{workspace.name}</span>
                            </div>
                        </Link>
                        </TableCell>
                        <TableCell>
                            <p className="text-muted-foreground truncate max-w-xs">{workspace.description}</p>
                        </TableCell>
                        <TableCell>{formatDate(workspace.createdAt)}</TableCell>
                        <TableCell className="text-right">
                            <ItemActions item={workspace} userId={user?.id} onWorkspaceDeleted={handleWorkspaceAction} />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden grid gap-4">
                {workspaces.map((workspace) => (
                    <Card key={workspace.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <Link href={`/workspace/${workspace.id}`} className="hover:underline flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <CardTitle className="text-base font-semibold truncate">{workspace.name}</CardTitle>
                                    </div>
                                </Link>
                                <ItemActions item={workspace} userId={user?.id} onWorkspaceDeleted={handleWorkspaceAction} />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <CardDescription>{workspace.description}</CardDescription>
                            <div className="text-sm text-muted-foreground mt-2">
                                Created: {formatDate(workspace.createdAt)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
      )}
    </div>
  );
}
