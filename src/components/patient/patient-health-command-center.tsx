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
