
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, Menu, LogOut, Home, User, Folder as FolderIcon, Github, Linkedin, Mail } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { href: "/", label: "Home", icon: Home, requiresAuth: false },
  { href: "/workspace", label: "Workspaces", icon: FolderIcon, requiresAuth: true },
  { href: "/dashboard", label: "Dashboard", icon: User, requiresAuth: true },
];

function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">&copy; 2024 Knowable.AI. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">Developed by Thakut Abhishek Singh</p>
                    <div className="flex items-center gap-3">
                        <Link href="https://github.com/thakurabhishekgit" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link href="https://www.linkedin.com/in/thakurabhisheksingh31305" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <Linkedin className="h-5 w-5" />
                             <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href="mailto:thakur.abhisheksinght97@gmail.com" className="text-muted-foreground hover:text-foreground">
                            <Mail className="h-5 w-5" />
                             <span className="sr-only">Email</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function NavLink({ item, isLoggedIn, pathname }) {
    if (item.requiresAuth && !isLoggedIn) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-not-allowed text-muted-foreground/50">
                            {item.label}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Please login to access.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Link
            href={item.href}
            className={cn(
                "transition-colors hover:text-foreground",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
            )}
        >
            {item.label}
        </Link>
    );
}

function Header({isLoggedIn, handleLogout}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const visibleMenuItems = menuItems;

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-50 shrink-0">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                    <SheetHeader className="p-4 border-b">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-left">
                            <BrainCircuit className="w-6 h-6 text-primary" />
                            <span className="text-lg">Knowable.AI</span>
                        </Link>
                    </SheetHeader>
                    
                    <nav className="grid gap-2 text-lg font-medium p-4">
                        {visibleMenuItems.map((item) => (
                           (!item.requiresAuth || isLoggedIn) && (
                             <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                                    pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.icon && <item.icon className="h-5 w-5" />}
                                {item.label}
                            </Link>
                           )
                        ))}
                    </nav>
                    
                    <div className="mt-auto p-4">
                        <Separator className="mb-4" />
                        {isLoggedIn ? (
                             <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-lg font-medium text-muted-foreground">
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </Button>
                        ) : (
                             <div className="flex flex-col gap-2">
                                <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
                                <Button asChild><Link href="/register">Get Started</Link></Button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
            
            {/* Desktop Menu */}
            <div className="flex items-center justify-between w-full">
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        <span className="text-lg hidden sm:inline-block">Knowable.AI</span>
                    </Link>
                </div>
                
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:justify-center md:gap-5 md:text-sm lg:gap-6 flex-1">
                    {visibleMenuItems.map((item) => (
                        <NavLink key={item.href} item={item} isLoggedIn={isLoggedIn} pathname={pathname} />
                    ))}
                </nav>
                
                <div className="flex items-center gap-4 flex-1 justify-end">
                    {isLoggedIn ? (
                        <UserNav />
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
    // Also listen for changes in storage that might indicate login/logout
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage')); // Notify other components
    router.push("/");
  };
  
  // Pages that should not show the footer or have a different layout structure
  const isDocumentPage = pathname.startsWith('/document/');
  const isResultsPage = pathname.startsWith('/results');
  const isFullScreenPage = isDocumentPage || isResultsPage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!isFullScreenPage && <Footer />}
    </div>
  );
}
