
"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2, MessageSquare, BookText, Lightbulb } from 'lucide-react';
import { answerQuestion, generateSummary } from '@/ai/flows/chat-flow';
import { api } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from './markdown-renderer';

const suggestionPrompts = [
    {
        icon: BookText,
        text: 'Generate Summary',
        action: 'summarize',
    },
    {
        icon: Lightbulb,
        text: 'Key Concepts',
        action: 'concepts',
    }
];

const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export function DocumentChat({ document }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [user, setUser] = useState(null);
  const scrollAreaRef = useRef(null);

  // Effect to get user data for avatar
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Effect to scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current?.children[0]) {
      const scrollableViewport = scrollAreaRef.current.children[1];
       setTimeout(() => {
        if(scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  // Effect to fetch chat history on component mount, re-running only when document.id changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!document?.id) {
        setIsHistoryLoading(false);
        setMessages([]); // Ensure chat is cleared if there's no document ID
        return
      };
      setIsHistoryLoading(true);
      try {
        const history = await api.get(`/api/questions/getDocumentQuestions/${document.id}`);
        if (history && Array.isArray(history)) {
          const formattedHistory = history.flatMap(item => [
            { text: item.question, from: 'user' },
            { text: item.answer, from: 'bot' }
          ]);
          setMessages(formattedHistory);
        } else {
            setMessages([]); // If response is not an array, start fresh
        }
      } catch (error) {
        // It's okay if this fails (e.g., 404), it just means no history yet.
        console.log("Could not fetch chat history, starting fresh.", error.message);
        setMessages([]); // Start with an empty chat on error
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchChatHistory();
  }, [document?.id]);

  const processRequest = async (question) => {
    const userMessage = { text: question, from: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add a temporary "thinking" message
    setMessages(prev => [...prev, { text: 'Thinking...', from: 'bot', isLoading: true }]);

    try {
        if (!document.textExtracted) {
            throw new Error("Document text is not available for chat.");
        }
        
        let aiAnswer;
        if (question.toLowerCase() === 'generate summary') {
            aiAnswer = await generateSummary({ documentText: document.textExtracted });
        } else if (question.toLowerCase() === 'key concepts') {
            aiAnswer = await answerQuestion({
                documentText: document.textExtracted,
                question: "What are the key concepts or main ideas in this document?",
            });
        } else {
             aiAnswer = await answerQuestion({
                documentText: document.textExtracted,
                question: question,
            });
        }
       
        const botMessage = { text: aiAnswer, from: 'bot' };
        
        // Replace the "thinking" message with the actual answer
        setMessages(prev => prev.map(m => m.isLoading ? botMessage : m));
        
        // Only save to backend if the answer wasn't an error message
        if (!aiAnswer.toLowerCase().includes('error') && !aiAnswer.toLowerCase().includes('overloaded')) {
             await api.post(`/api/questions/document/${document.id}`, {
                question: question,
                answer: aiAnswer
            });
        }

    } catch (error) {
        console.error("Failed to get answer from AI or save question:", error);
        const errorMessageText = error.message.toLowerCase().includes('overloaded')
            ? "The AI service is currently overloaded. Please try again in a moment."
            : "Sorry, I couldn't process that question. Please try again later.";
        
        const errorMessage = { text: errorMessageText, from: 'bot' };
        setMessages(prev => prev.map(m => m.isLoading ? errorMessage : m));
        
        toast({
            variant: "destructive",
            title: "Chat Error",
            description: "There was a problem communicating with the AI.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    const currentQuestion = input;
    setInput('');
    await processRequest(currentQuestion);
  };

  const handleSuggestionClick = async (promptText) => {
    if (isLoading) return;
    await processRequest(promptText);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden min-h-0 p-2 md:p-4">
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {isHistoryLoading ? (
            <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Loading chat history...</p>
            </div>
        </div>
        ) : messages.length > 0 ? (
        <div className="space-y-4">
            {messages.map((message, index) => (
            <div
                key={index}
                className={`flex items-start gap-2 ${
                message.from === 'user' ? 'justify-end' : ''
                }`}
            >
                {message.from === 'bot' && (
                <div className="p-2 rounded-full bg-muted shrink-0">
                    <Bot className="w-5 h-5" />
                </div>
                )}
                <div
                className={`rounded-lg p-2 md:p-3 max-w-[90%] text-sm break-words ${
                    message.from === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
                >
                    {message.isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <p>{message.text}</p>
                        </div>
                    ) : (
                        message.from === 'bot' 
                            ? <MarkdownRenderer content={message.text} />
                            : <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
                    )}
                </div>
                {message.from === 'user' && (
                    <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={user?.profilePictureUrl} alt={user?.username} />
                        <AvatarFallback>{user ? getInitials(user.username) : 'U'}</AvatarFallback>
                    </Avatar>
                )}
            </div>
            ))}
        </div>
        ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                <p>Chat with your document.</p>
                <p className="text-xs">Ask a question or use a suggestion below.</p>
            </div>
        </div>
        )}
    </ScrollArea>
     <div className='pt-2 mt-auto'>
        <div className='flex items-center justify-center gap-2 mb-2'>
            {suggestionPrompts.map((prompt, index) => (
                <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="justify-start text-left h-auto p-2"
                    onClick={() => handleSuggestionClick(prompt.text)}
                    disabled={isLoading}
                >
                    <prompt.icon className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs">{prompt.text}</span>
                </Button>
            ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t">
            <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the document..."
            autoComplete="off"
            disabled={isLoading || isHistoryLoading}
            className="text-sm"
            />
            <Button type="submit" size="icon" disabled={isLoading || isHistoryLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
            </Button>
        </form>
    </div>
    </div>
  );
}
