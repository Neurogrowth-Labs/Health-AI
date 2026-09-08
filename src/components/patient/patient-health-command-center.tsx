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

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#008f7a]">Your health space</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{greetingLine()}, {firstName}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">A clear view of your next care step, with AI guidance and a direct route to a health professional when you need one.</p></div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />{isOnline ? 'Live updates on' : 'Offline view'}{lastUpdated && <span>· updated {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}</div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => router.push('/patient/ai-chat')} className="h-12 rounded-full bg-[#00A88F] px-5 font-semibold text-[#071A2B] hover:bg-[#20b79f]"><HeartPulse className="mr-2 h-4 w-4" /> Ask AI Health</Button><Button variant="outline" onClick={() => router.push('/patient/find')} className="h-12 rounded-full border-[#b9d9d1] bg-white px-5"><MapPin className="mr-2 h-4 w-4 text-[#008f7a]" /> Find care</Button><Button variant="ghost" onClick={() => router.push('/patient/appointments')} className="h-12 rounded-full px-5"><CalendarDays className="mr-2 h-4 w-4" /> My care plan</Button></div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">

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
