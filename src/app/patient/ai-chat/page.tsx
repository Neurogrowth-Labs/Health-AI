'use client'

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIChatPage() {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'Hello! I am the Health AI preliminary assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMsgs = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect to AI.');
      setMessages([...newMsgs, { role: 'model', text: data.text }]);
    } catch (error: any) {
      setMessages([...newMsgs, { role: 'model', text: `Error: ${error.message || "Failed to connect to AI."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white rounded-t-2xl">
        <CardTitle className="text-xl flex items-center gap-2 text-slate-900 tracking-tight">
          <Bot className="text-blue-600 h-6 w-6" />
          Free AI Consultation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "flex gap-3 max-w-[80%]",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === 'user' ? "bg-blue-600" : "bg-slate-200"
              )}>
                {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-slate-600" />}
              </div>
              <div className={cn(
                "px-4 py-2 rounded-2xl",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-100 text-slate-900 rounded-tl-none"
              )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex gap-3 max-w-[80%] flex-row">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-slate-600" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 rounded-tl-none">
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2 w-full">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Type your symptoms or questions..." 
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
