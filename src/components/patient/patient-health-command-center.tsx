'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  FileText,
  HeartPulse,
  MapPin,
  Pill,
  RefreshCw,
  WifiOff,
} from 'lucide-react';

type Appointment = { id: string; date: string; timeStr: string; type: 'PHYSICAL' | 'VIRTUAL'; status: string };

function greetingLine() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

function formatAppointment(appointment: Appointment) {
  const date = new Date(`${appointment.date}T${appointment.timeStr}`);
  if (Number.isNaN(date.getTime())) return `${appointment.date} · ${appointment.timeStr}`;
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

export function PatientHealthCommandCenter() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshAppointments = useCallback(async () => {
    try {
      const response = await fetch('/api/appointments', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to refresh care plan');
      const data = await response.json();
      setAppointments(data.appointments ?? []);
      setLastUpdated(new Date());
    } catch {
      // Preserve the last safe state and explain connectivity in the interface instead of interrupting care.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const online = () => { setIsOnline(true); refreshAppointments(); };
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    refreshAppointments();
    const interval = window.setInterval(() => { if (navigator.onLine) refreshAppointments(); }, 30_000);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); window.clearInterval(interval); };
  }, [refreshAppointments]);

  const upcoming = appointments
    .filter((item) => ['PENDING', 'CONFIRMED'].includes(item.status))
    .sort((a, b) => `${a.date}T${a.timeStr}`.localeCompare(`${b.date}T${b.timeStr}`));
  const nextAppointment = upcoming[0];
  const firstName = user?.name?.trim().split(' ')[0] || 'there';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-[#071A2B]">
      {!isOnline && <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><span className="flex items-center gap-2"><WifiOff className="h-4 w-4" /> Low connectivity — your last synced information remains available.</span><Button size="sm" variant="outline" onClick={refreshAppointments} className="border-amber-300 bg-white">Try again</Button></div>}

      <header className="health-card rounded-3xl border border-[#cde5df] bg-gradient-to-br from-[#f3fbf8] via-white to-[#e7f6f2] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#008f7a]">Your health space</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{greetingLine()}, {firstName}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">A clear view of your next care step, with AI guidance and a direct route to a health professional when you need one.</p></div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />{isOnline ? 'Live updates on' : 'Offline view'}{lastUpdated && <span>· updated {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}</div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => router.push('/patient/ai-chat')} className="h-12 rounded-full bg-[#00A88F] px-5 font-semibold text-[#071A2B] hover:bg-[#20b79f]"><HeartPulse className="mr-2 h-4 w-4" /> Ask AI Health</Button><Button variant="outline" onClick={() => router.push('/patient/find')} className="h-12 rounded-full border-[#b9d9d1] bg-white px-5"><MapPin className="mr-2 h-4 w-4 text-[#008f7a]" /> Find care</Button><Button variant="ghost" onClick={() => router.push('/patient/appointments')} className="h-12 rounded-full px-5"><CalendarDays className="mr-2 h-4 w-4" /> My care plan</Button></div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card className="health-card border-[#d9e8e4] shadow-sm"><CardContent className="p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">What is happening?</p><h2 className="mt-2 text-xl font-semibold">{nextAppointment ? 'Your next care appointment is scheduled.' : 'You have no upcoming appointments.'}</h2></div><div className="text-right"><CalendarDays className="ml-auto h-5 w-5 text-[#008f7a]" /><p className="mt-2 text-2xl font-semibold tabular-nums text-[#071A2B]">{upcoming.length}</p><p className="text-[11px] text-slate-500">upcoming</p></div></div>{isLoading ? <div className="health-skeleton mt-6 h-16 rounded-xl" /> : nextAppointment ? <div className="mt-6 rounded-2xl bg-[#f4faf8] p-4"><p className="font-semibold">{formatAppointment(nextAppointment)}</p><p className="mt-1 text-sm text-slate-600">{nextAppointment.type === 'VIRTUAL' ? 'Virtual consultation' : 'In-person appointment'} · {nextAppointment.status.toLowerCase()}</p></div> : <p className="mt-5 text-sm leading-6 text-slate-600">Find a verified clinician or use AI Health Navigator to understand the right next step.</p>}<div className="mt-6 flex items-center justify-between border-t border-[#e7efec] pt-4"><span className="text-sm text-slate-600">What should happen next?</span><Button variant="ghost" size="sm" onClick={() => router.push(nextAppointment ? '/patient/appointments' : '/patient/find')}>{nextAppointment ? 'View appointment' : 'Find care'} <ChevronRight className="ml-1 h-4 w-4" /></Button></div></CardContent></Card>
        <Card className="ai-glow health-card overflow-hidden border-[#222b6e] bg-[#111b44] text-white shadow-sm"><CardContent className="relative p-6"><div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(165,180,252,.42)_1px,transparent_0)] [background-size:20px_20px]" /><div className="relative"><div className="flex items-center gap-2 text-[#b9c0ff]"><Activity className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-[.14em]">AI Health Navigator</p></div><h2 className="mt-3 text-xl font-semibold">Tell us what is happening.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Answer a few structured questions. You can always stop, contact a clinician, or seek urgent care.</p><svg className="mt-4 h-10 w-full" viewBox="0 0 240 40" aria-label="Illustrative AI health signal" role="img"><path d="M0 29 L35 29 L49 20 L62 34 L81 8 L96 29 L126 29 L140 21 L156 31 L178 13 L190 29 L240 29" fill="none" stroke="#9ca3ff" strokeWidth="2" className="health-graph-line" /></svg><Button onClick={() => router.push('/patient/ai-chat')} className="mt-4 h-10 w-full rounded-xl bg-[#a3e635] font-semibold text-[#15212e] hover:bg-[#b2ec50]">Start a health check</Button></div></CardContent></Card>
      </section>

      <section><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Quick actions</p><h2 className="mt-1 text-xl font-semibold">Take care of what matters now.</h2></div><Button size="icon-sm" variant="ghost" aria-label="Refresh care information" onClick={refreshAppointments}><RefreshCw className="h-4 w-4" /></Button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ label: 'Check symptoms', description: 'Guided next steps', icon: HeartPulse, route: '/patient/ai-chat' }, { label: 'Book care', description: 'Find a clinician', icon: CalendarDays, route: '/patient/find' }, { label: 'Health records', description: 'Documents and results', icon: FileText, route: '/patient/documents' }, { label: 'Medication', description: 'Manage care details', icon: Pill, route: '/patient/settings' }].map(({ label, description, icon: Icon, route }) => <button key={label} onClick={() => router.push(route)} className="health-card group rounded-2xl border border-[#d9e8e4] bg-white p-5 text-left shadow-sm"><Icon className="h-5 w-5 text-[#008f7a]" /><p className="mt-7 font-semibold">{label}</p><p className="mt-1 text-sm text-slate-500">{description}</p></button>)}</div></section>

      <section className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#d9e8e4] bg-white p-5"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#008f7a]" /><h2 className="font-semibold">Care reminders</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">We will only notify you about appointment changes and important care updates. You can manage notifications in settings.</p></div><div className="rounded-2xl border border-[#f0dca5] bg-[#fffbef] p-5"><div className="flex items-center gap-2"><CircleAlert className="h-4 w-4 text-[#a97700]" /><h2 className="font-semibold">Need urgent help?</h2></div><p className="mt-3 text-sm leading-6 text-slate-700">For severe symptoms or an emergency, contact local emergency services or go to the nearest emergency facility.</p></div></section>
    </div>
  );
}

/** A concise, reusable trust reminder for secondary patient workflows. */
export function PatientCrossAiLayer() {
  return (
    <div className="rounded-2xl border border-[#d9e8e4] bg-[#f8fbfa] p-5">
      <div className="flex items-center gap-2 text-[#008f7a]"><HeartPulse className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-[.14em]">Your Health AI</p></div>
      <p className="mt-2 text-sm leading-6 text-slate-600">AI guidance is based only on the information you choose to share. It supports your next step and never replaces a clinician’s judgment.</p>
    </div>
  );
}
