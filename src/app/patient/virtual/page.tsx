'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Send, User, Stethoscope, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VirtualChatPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const [hasPaid, setHasPaid] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'me' | 'doc'; text: string }[]>([]);
  const [input, setInput] = useState('');

  if (!docId) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Please select a doctor from the &quot;Find Doctors&quot; tab to start a virtual chat.
        </CardContent>
      </Card>
    );
  }

  if (!hasPaid) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paid Virtual Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You are about to start a 30-minute virtual chat session. The fee is $50.
          </p>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-2xl font-bold text-primary">$50.00</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setHasPaid(true)}>
            Pay & Start Chat
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'me', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'doc', text: 'Thank you for the message. How can I help you?' },
      ]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Virtual Chat with Doctor
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Send a message to start the consultation.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex w-full', msg.sender === 'me' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'flex gap-3 max-w-[80%]',
                msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar>
                <AvatarFallback
                  className={
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-green-500 text-white'
                  }
                >
                  {msg.sender === 'me' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Stethoscope className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'px-4 py-2 rounded-2xl',
                  msg.sender === 'me'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted rounded-tl-none'
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-4 border-t border-border">
        <form onSubmit={handleSend} className="flex gap-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
