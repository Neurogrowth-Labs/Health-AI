'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoctorToggle } from '@/components/doctor/doctor-toggle';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import { availabilityTools } from '@/lib/doctor-ai-capabilities';
import { CalendarDays, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

function slotClass() {
  return 'bg-slate-50 border-slate-200/80 text-slate-400';
}

export default function AvailabilityPage() {
  const [autoSchedule, setAutoSchedule] = useState(false);

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
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Confirmed
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Predicted no-show
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> High priority
              </span>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto pt-4">
            <p className="mb-3 text-xs text-slate-500">No bookings loaded — grid is ready for your schedule data.</p>
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
                      title={`${day} ${h}`}
                      className={cn(
                        'h-10 rounded-md border text-[10px] font-medium transition hover:opacity-95',
                        slotClass(),
                      )}
                    />
                  )),
                ])}
              </div>
            </div>
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
