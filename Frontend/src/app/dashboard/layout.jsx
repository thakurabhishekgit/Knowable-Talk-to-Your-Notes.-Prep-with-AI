
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, User, Folder } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);


  const fetchWorkspaces = async (userId) => {
    try {
        const fetchedWorkspaces = await api.get(`/api/workspace/user/${userId}`);
        setWorkspaces(fetchedWorkspaces);
         const localUser = JSON.parse(localStorage.getItem('user'));
         if(localUser) {
             localUser.workspaces = fetchedWorkspaces;
             localStorage.setItem('user', JSON.stringify(localUser));
         }
    } catch (error) {
        console.error("Failed to fetch workspaces for sidebar", error);
    }
  }

  useEffect(() => {
    const handleStorageChange = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.id) {
                fetchWorkspaces(parsedUser.id);
            }
        } else {
            setUser(null);
            setWorkspaces([]);
        }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    router.push("/");
  };
  
  const sidebarNavItems = [
    { title: "Profile", href: "/dashboard/settings", icon: User },
    // Add more items here if needed
  ];

  if (isCheckingAuth) {
    return <div className="p-10">Checking authentication...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5 lg:shrink-0">
          <nav className="flex flex-col space-y-2">
             <div className="px-0 md:px-4 py-2">
                <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">Workspaces</h3>
                <div className="flex flex-col gap-1">
                    {workspaces && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <Link
                                key={workspace.id}
                                href={`/workspace/${workspace.id}`}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "justify-start gap-2 truncate"
                                )}
                            >
                                <Folder className="h-4 w-4 shrink-0" />
                                <span className="truncate">{workspace.name}</span>
                            </Link>
                        ))
                    ) : (
                        <p className="px-2 text-sm text-muted-foreground">No workspaces yet.</p>
                    )}
                </div>
            </div>
            <Separator />
            <div className="px-0 md:px-4 py-2">
                 <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">Settings</h3>
                {sidebarNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start gap-2"
                        )}
                    >
                       <item.icon className="h-4 w-4" />
                       {item.title}
                    </Link>
                ))}
                <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 w-full text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
          </nav>
        </aside>
        <div className="flex-1 w-full min-w-0">{children}</div>
      </div>
    </div>
  )
}
