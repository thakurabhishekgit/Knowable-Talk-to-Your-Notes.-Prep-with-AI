"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function OAuth2SuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const data = await api.get('/api/users/oauth2/success');
        
        if (data && data.user && data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          toast({
            title: data.isNew ? "Account Created!" : "Login Successful",
            description: data.isNew ? "Welcome to Knowable.AI!" : "Welcome back!",
          });
          
          window.dispatchEvent(new Event('storage'));
          router.push('/dashboard');
        } else {
          throw new Error("Invalid authentication response from server.");
        }
      } catch (err) {
        console.error("OAuth login failed:", err);
        setError(err.message || "An unknown error occurred during login.");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not complete login with Google. Please try again.",
        });
      }
    };

    handleOAuthSuccess();
  }, [router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {error ? (
        <>
          <h1 className="text-2xl font-bold text-destructive mb-4">Login Failed</h1>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <button onClick={() => router.push('/login')} className="text-primary underline">
            Return to Login
          </button>
        </>
      ) : (
        <>
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold">Finalizing Login...</h1>
          <p className="text-muted-foreground">Please wait while we securely log you in.</p>
        </>
      )}
    </div>
  );
}
