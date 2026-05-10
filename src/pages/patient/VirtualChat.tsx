import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Send, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function VirtualChat() {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('docId');
  const [hasPaid, setHasPaid] = useState(false);
  const [messages, setMessages] = useState<{sender: 'me' | 'doc', text: string}[]>([]);
  const [input, setInput] = useState('');

  if (!docId) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          Please select a doctor from the "Find Doctors" tab to start a virtual chat.
        </CardContent>
      </Card>
    );
  }

  if (!hasPaid) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Paid Virtual Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">You are about to start a 30-minute virtual chat session. The fee is $50.</p>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold text-blue-600">$50.00</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setHasPaid(true)}>Pay & Start Chat</Button>
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
      setMessages(prev => [...prev, { sender: 'doc', text: "Thank you for the message. How can I help you?" }]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
           Virtual Chat with Doctor
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400">
            Send a message to start the consultation.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full", msg.sender === 'me' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "flex gap-3 max-w-[80%]",
              msg.sender === 'me' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.sender === 'me' ? "bg-blue-600" : "bg-green-600"
              )}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className={cn(
                "px-4 py-2 rounded-2xl",
                msg.sender === 'me' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-100 text-slate-900 rounded-tl-none"
              )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2 w-full">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
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
