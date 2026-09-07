'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, Bot, CircleAlert, Loader2, MessageSquareHeart, Send, ShieldAlert, User, WifiOff } from 'lucide-react';

type Message = { id: string; role: 'user' | 'model'; text: string };

const starterPrompts = ['I have a new symptom', 'I need help understanding a result', 'I want to find care'];

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'model', text: "I’m AI Health Navigator. I can help you understand the right next step, but I do not diagnose. What is bothering you today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    if (!navigator.onLine) { setError('You are offline. Reconnect to continue the AI conversation, or find care directly.'); return; }
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages.map(({ role, text }) => ({ role, text })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI Health is temporarily unavailable.');
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'model', text: data.text }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'AI Health is temporarily unavailable.');
    } finally { setIsLoading(false); }
  };

  const handleSend = (event: FormEvent) => { event.preventDefault(); sendMessage(input); };
  const restart = () => { setMessages([{ id: crypto.randomUUID(), role: 'model', text: "Let’s start again. What is bothering you today?" }]); setError(''); setInput(''); };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#d9e8e4] bg-white shadow-sm">
      <header className="border-b border-[#d9e8e4] bg-[#f5fbf9] px-5 py-4 sm:px-6"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><button onClick={() => router.push('/patient')} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-white" aria-label="Back to health home"><ArrowLeft className="h-4 w-4" /></button><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e1f5f0] text-[#008f7a]"><MessageSquareHeart className="h-5 w-5" /></div><div className="min-w-0"><h1 className="font-semibold text-[#071A2B]">AI Health Navigator</h1><p className="truncate text-xs text-slate-500">Guidance and triage support — not a diagnosis</p></div></div><div className={`hidden items-center gap-2 text-xs sm:flex ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}><span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />{isOnline ? 'Secure connection' : 'Offline'}</div></div></header>

      {!isOnline && <div role="status" className="flex flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-950"><WifiOff className="h-4 w-4" /> Your connection is limited. The conversation will resume when you reconnect.</div>}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_260px]"><main ref={scrollRef} className="min-h-[420px] space-y-5 overflow-y-auto p-5 sm:p-7" aria-live="polite">{messages.map((message) => <div key={message.id} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}><div className={cn('flex max-w-[92%] gap-3 sm:max-w-[80%]', message.role === 'user' && 'flex-row-reverse')}><div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', message.role === 'user' ? 'bg-[#071A2B] text-white' : 'bg-[#e1f5f0] text-[#008f7a]')}>{message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</div><div className={cn('rounded-2xl px-4 py-3 text-sm leading-6', message.role === 'user' ? 'rounded-tr-sm bg-[#071A2B] text-white' : 'rounded-tl-sm bg-[#f1f6f5] text-slate-800')}><p className="whitespace-pre-wrap">{message.text}</p></div></div></div>)}{isLoading && <div className="flex gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e1f5f0] text-[#008f7a]"><Bot className="h-4 w-4" /></div><div className="flex items-center rounded-2xl rounded-tl-sm bg-[#f1f6f5] px-4 py-3 text-sm text-slate-600"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing your response…</div></div>}{error && <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><div className="flex gap-2"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>{error}</p></div><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => sendMessage(input)} disabled={!input.trim() || !isOnline}>Retry</Button><Button size="sm" variant="ghost" onClick={() => router.push('/patient/find')}>Find care</Button></div></div>}</main>
        <aside className="border-t border-[#d9e8e4] bg-[#f8fbfa] p-5 lg:border-l lg:border-t-0"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#008f7a]">Start here</p><p className="mt-2 text-sm leading-6 text-slate-600">Choose a topic or tell us in your own words.</p><div className="mt-4 space-y-2">{starterPrompts.map((prompt) => <button key={prompt} disabled={isLoading} onClick={() => sendMessage(prompt)} className="w-full rounded-xl border border-[#d9e8e4] bg-white px-3 py-2.5 text-left text-sm font-medium text-[#071A2B] hover:border-[#8bcfc0] disabled:opacity-50">{prompt}</button>)}</div><div className="mt-6 rounded-xl border border-[#f0dca5] bg-[#fffbed] p-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#815d00]"><ShieldAlert className="h-4 w-4" /> Emergency?</div><p className="mt-2 text-xs leading-5 text-slate-600">If symptoms are severe or life-threatening, contact local emergency services now.</p><Button size="sm" variant="outline" onClick={() => router.push('/patient/find')} className="mt-3 w-full border-amber-300 bg-white">Find urgent care</Button></div><Button variant="ghost" onClick={restart} className="mt-4 w-full text-slate-600">Start a new conversation</Button></aside></div>
      <form onSubmit={handleSend} className="border-t border-[#d9e8e4] bg-white p-4 sm:p-5"><div className="flex gap-2"><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell me what is happening…" disabled={isLoading} maxLength={1200} className="h-12 rounded-xl border-[#cbded8] px-4" aria-label="Your health question" /><Button type="submit" disabled={isLoading || !input.trim()} className="h-12 rounded-xl bg-[#00A88F] px-4 text-[#071A2B] hover:bg-[#20b79f]" aria-label="Send message"><Send className="h-4 w-4" /></Button></div><p className="mt-2 text-xs text-slate-500">Do not include information you would not want in your health record. AI Health provides guidance only.</p></form>
    </div>
  );
}
