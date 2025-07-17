
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page is deprecated and now redirects to the new dashboard settings area.
export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);
  
  return (
      <div className="flex items-center justify-center h-full p-10">
        <h1 className="text-2xl font-bold">Redirecting to settings...</h1>
      </div>
  );
}
