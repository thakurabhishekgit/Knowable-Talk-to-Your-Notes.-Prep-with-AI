
"use client";

import Link from "next/link";
import { BrainCircuit, BookOpen, Layers, FileQuestion, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useEffect, useState } from "react";

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border flex flex-col items-center text-center">
        <div className="bg-primary/10 p-3 rounded-full mb-4 border border-primary/20">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Unlock Your Academic Potential with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Knowable.AI transforms your study materials—lecture notes, textbooks, and PDFs—into interactive learning experiences. Prepare for exams, clarify complex topics, and study smarter, not harder.
            </p>
            <Button asChild size="lg">
              <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                {isLoggedIn ? "Go to Dashboard" : "Sign Up for Free"}
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Your Ultimate Study Partner</h2>
              <p className="text-muted-foreground mt-4">
                From automated study tools to in-depth analysis, we have everything you need to succeed.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={Layers}
                title="Generate Study Tools"
                description="Instantly create flashcards and multiple-choice quizzes from any document to test your knowledge and reinforce key concepts."
              />
              <FeatureCard 
                icon={FileQuestion}
                title="Analyze Past Papers"
                description="Upload previous exam papers and let our AI identify the most frequently tested topics, helping you focus your revision."
              />
               <FeatureCard 
                icon={BookOpen}
                title="AI-Powered Study Guides"
                description="Automatically extract main topics, a glossary of key terms, and potential exam questions from your study materials."
              />
              <FeatureCard 
                icon={MessageSquare}
                title="Document Chat"
                description="Have a conversation with your documents. Ask questions, get summaries, and clarify confusing points in real-time."
              />
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="A student interacting with an AI interface on a laptop"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl"
                        data-ai-hint="student AI"
                    />
                </div>
                <div className="lg:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple Steps to Smarter Studying</h2>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                             <div className="bg-primary/10 p-3 rounded-full border border-primary/20 mt-1 shrink-0">
                                <span className="text-primary font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Upload Your Documents</h3>
                                <p className="text-muted-foreground">Add your PDFs, lecture notes, or textbook chapters. We'll process the text and make it ready for analysis.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full border border-primary/20 mt-1 shrink-0">
                                <span className="text-primary font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Choose Your Tool</h3>
                                <p className="text-muted-foreground">Select from a suite of AI tools—generate a quiz, create flashcards, analyze a past paper, or simply chat with your document.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                           <div className="bg-primary/10 p-3 rounded-full border border-primary/20 mt-1 shrink-0">
                                <span className="text-primary font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Master Your Subjects</h3>
                                <p className="text-muted-foreground">Use the AI-generated insights and materials to study efficiently, understand topics deeply, and walk into your exams with confidence.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
