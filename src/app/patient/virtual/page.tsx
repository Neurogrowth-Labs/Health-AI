'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientConsultationTools } from '@/lib/patient-ai-capabilities';
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

  const layout = (body: ReactNode) => (
    <div className="space-y-8">
      <PatientAiModuleSection
        eyebrow="Consultations"
        title="AI-Powered Care Experience"
        description="Symptom intelligence, live assist, transcription, and post-visit insights layer onto your virtual visit — advisory until integrations are enabled."
        tools={patientConsultationTools}
      />
      {body}
      <PatientCrossAiLayer />
    </div>
  );

  if (!docId) {
    return layout(
      <Card className="border-slate-200/90 shadow-md">
        <CardContent className="py-12 text-center text-muted-foreground">
          Select a doctor from <span className="font-medium text-sky-800">Find Doctors</span> to start a virtual
          consult. AI tools above activate when a session is connected.
        </CardContent>
      </Card>,
    );
  }

  if (!hasPaid) {
    return layout(
      <Card className="mx-auto mt-2 max-w-md border-slate-200/90 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-600" />
            Paid virtual consult
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Start a 30-minute virtual chat session. Example fee shown for demo purposes.
          </p>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-bold text-sky-700">$50.00</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-sky-600 hover:bg-sky-600/90" onClick={() => setHasPaid(true)}>
            Pay &amp; start chat
          </Button>
        </CardFooter>
      </Card>,
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

  return layout(
    <Card className="flex h-[600px] flex-col border-slate-200/90 shadow-md">
      <CardHeader className="border-b border-sky-100/80">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-teal-600" />
          Virtual chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
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
                'flex max-w-[80%] gap-3',
                msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              <Avatar>
                <AvatarFallback
                  className={
                    msg.sender === 'me'
                      ? 'bg-sky-600 text-white'
                      : 'bg-teal-600 text-white'
                  }
                >
                  {msg.sender === 'me' ? <User className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'rounded-2xl px-4 py-2',
                  msg.sender === 'me'
                    ? 'rounded-tr-none bg-sky-600 text-white'
                    : 'rounded-tl-none bg-slate-100 text-slate-900',
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-sky-100/80 p-4">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()} className="bg-sky-600 hover:bg-sky-600/90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>,
  );
}
