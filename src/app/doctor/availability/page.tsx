'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoctorToggle } from '@/components/doctor/doctor-toggle';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import { availabilityTools } from '@/lib/doctor-ai-capabilities';
import { CalendarDays, Sparkles, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dayIndexMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  timeSlot: string;
  isAvailable: boolean;
  autoSchedule: boolean;
}

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/doctors/availability?doctorId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const isSlotAvailable = (day: string, hour: string): boolean => {
    const dayNum = dayIndexMap[day];
    const slot = slots.find((s) => s.dayOfWeek === dayNum && s.timeSlot === hour);
    return slot?.isAvailable ?? false;
  };

  const toggleSlot = async (day: string, hour: string) => {
    if (!user?.id) return;
    const dayNum = dayIndexMap[day];
    const key = `${day}-${hour}`;
    setSaving(key);

    const current = isSlotAvailable(day, hour);

    // Optimistic update
    setSlots((prev) => {
      const idx = prev.findIndex((s) => s.dayOfWeek === dayNum && s.timeSlot === hour);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], isAvailable: !current };
        return updated;
      }
      return [
        ...prev,
        { id: '', doctorId: user.id, dayOfWeek: dayNum, timeSlot: hour, isAvailable: !current, autoSchedule: false },
      ];
    });

    try {
      await fetch('/api/doctors/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: user.id,
          dayOfWeek: dayNum,
          timeSlot: hour,
          isAvailable: !current,
          autoSchedule,
        }),
      });
    } catch (err) {
      console.error('Failed to update slot:', err);
      // Revert on error
      setSlots((prev) => {
        const idx = prev.findIndex((s) => s.dayOfWeek === dayNum && s.timeSlot === hour);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], isAvailable: current };
          return updated;
        }
        return prev;
      });
    } finally {
      setSaving(null);
    }
  };

  const slotClass = (day: string, hour: string) => {
    if (isSlotAvailable(day, hour)) {
      return 'bg-emerald-100 border-emerald-300 text-emerald-700';
    }
    return 'bg-slate-50 border-slate-200/80 text-slate-400';
  };

  const availableCount = slots.filter((s) => s.isAvailable).length;
  const totalCount = days.length * hours.length;

  return (
    <div className="flex min-h-0 flex-col gap-4 text-[#0A2540]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
          <h1 className="text-2xl font-bold">AI Scheduling &amp; Optimization Engine</h1>
          <p className="mt-1 text-sm text-slate-600">
            Calendar plus five AI engines for smarter slots, no-shows, workload balance, and rebooking.
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center sm:gap-4">
          <div className="rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2">
            <DoctorToggle
              id="auto-schedule"
              checked={autoSchedule}
              onCheckedChange={setAutoSchedule}
              label="Auto-schedule"
              description="AI fills low-risk gaps automatically"
            />
          </div>
          <Button type="button" className="gap-2 bg-[#00C2A8] text-[#0A2540] hover:bg-[#00C2A8]/90">
            <Sparkles className="h-4 w-4" />
            Optimize my day (AI)
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availabilityTools.map((cap) => (
            <AiCapabilityCard key={cap.id} capability={cap}>
              <p className="text-center text-xs text-slate-500">
                Live suggestions for this engine will populate when appointments and history are connected.
              </p>
            </AiCapabilityCard>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <Card className="min-h-[420px] flex-1 border-slate-200/90 shadow-md lg:min-h-[520px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <CalendarDays className="h-5 w-5 text-[#00C2A8]" />
              Week view
            </CardTitle>
            <div className="flex flex-wrap gap-3 text-[10px] font-medium text-slate-600 sm:text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Unavailable
              </span>
              <span className="text-slate-400">
                {availableCount}/{totalCount} slots open
              </span>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">Loading availability...</span>
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs text-slate-500">
                  Click a slot to toggle availability. Changes save automatically.
                </p>
                <div className="min-w-[640px]">
                  <div
                    className="grid gap-1"
                    style={{ gridTemplateColumns: `100px repeat(${days.length}, minmax(0, 1fr))` }}
                  >
                    <div />
                    {days.map((d) => (
                      <div key={d} className="px-1 text-center font-mono text-xs font-semibold text-slate-500">
                        {d}
                      </div>
                    ))}
                    {hours.flatMap((h) => [
                      <div
                        key={`${h}-label`}
                        className="flex items-center justify-end pr-2 font-mono text-[11px] text-slate-500"
                      >
                        {h}
                      </div>,
                      ...days.map((day) => (
                        <button
                          key={`${day}-${h}`}
                          type="button"
                          title={`${day} ${h} — ${isSlotAvailable(day, h) ? 'Available' : 'Unavailable'}`}
                          onClick={() => toggleSlot(day, h)}
                          disabled={saving === `${day}-${h}`}
                          className={cn(
                            'h-10 rounded-md border text-[10px] font-medium transition hover:opacity-80 active:scale-95',
                            slotClass(day, h),
                            saving === `${day}-${h}` && 'animate-pulse',
                          )}
                        >
                          {isSlotAvailable(day, h) ? 'Open' : ''}
                        </button>
                      )),
                    ])}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="w-full shrink-0 border-slate-200/90 shadow-md lg:w-80">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-bold">Suggestion stream</CardTitle>
            <p className="text-xs text-slate-600">Output from the engines above</p>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-6 text-center text-sm text-slate-500">
              No live suggestions yet. Optimization, no-show, and burnout models need schedule + visit history.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/90 shadow-md">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-bold text-[#0A2540]">Burnout prevention monitor</p>
              <p className="text-xs text-slate-600">Tied to the Burnout Prevention AI capability — surface loads here.</p>
            </div>
          </div>
          <div className="w-full max-w-md sm:w-1/2">
            <p className="text-sm text-slate-500">
              Workload insights will appear when your schedule and activity are synced.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
