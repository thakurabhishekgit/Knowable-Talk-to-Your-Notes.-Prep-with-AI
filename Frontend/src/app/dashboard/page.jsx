
"use client";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
import { Folder } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardContent>
            </Card>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="h-full flex flex-col">
                        <CardHeader>
                             <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkspaces = async (userId) => {
        try {
            const fetchedWorkspaces = await api.get(`/api/workspace/user/${userId}`);
            setWorkspaces(fetchedWorkspaces);

            const localUser = JSON.parse(localStorage.getItem('user'));
            if(localUser) {
                localUser.workspaces = fetchedWorkspaces;
                localStorage.setItem('user', JSON.stringify(localUser));
                 window.dispatchEvent(new Event('storage'));
            }

        } catch (error) {
            console.error("Failed to fetch workspaces", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if(userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.id) {
                fetchWorkspaces(parsedUser.id);
            }
        } else {
            setLoading(false);
        }
    }, [])

    if (loading) {
        return <DashboardSkeleton />
    }

    return (
      <div className="space-y-8">
        {user && (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.profilePictureUrl || "https://placehold.co/100x100.png"} alt={user.username} data-ai-hint="profile" />
                            <AvatarFallback className="text-2xl">{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{user.username}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        {user.universityName && <p><span className="font-semibold text-foreground">University:</span> {user.universityName}</p>}
                        {user.createdAt && <p><span className="font-semibold text-foreground">Member since:</span> {formatDate(user.createdAt)}</p>}
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome, {user?.username}!</h2>
                <p className="text-muted-foreground">
                Here are your knowledge workspaces.
                </p>
            </div>
        </div>
        
        {workspaces && workspaces.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((workspace) => (
                    <Link href={`/workspace/${workspace.id}`} key={workspace.id} className="block">
                        <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Folder className="h-6 w-6 text-primary shrink-0" />
                                    <CardTitle className="truncate">{workspace.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription className="line-clamp-2">{workspace.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 border rounded-lg">
                <h3 className="text-xl font-semibold">No workspaces yet</h3>
                <p className="text-muted-foreground mt-2">Get started by creating a new workspace.</p>
            </div>
        )}
      </div>
  );
}
