'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import {
  dashboardConnections,
  overviewHubTools,
  unifiedAiLayerBullets,
} from '@/lib/doctor-ai-capabilities';
import { Cpu, FileText, Stethoscope } from 'lucide-react';

function doctorDisplayName(name: string | undefined) {
  if (!name?.trim()) return 'Doctor';
  const t = name.trim();
  if (/^dr\.?\s/i.test(t)) return t;
  return `Dr. ${t}`;
}

function greetingLine() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function LiveOutputPlaceholder({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-slate-200/90 bg-slate-50/70 px-3 py-4 text-center text-xs text-slate-500">
      {children}
    </p>
  );
}

export function ClinicalIntelligenceHub() {
  const { user } = useAuth();
  const docName = doctorDisplayName(user?.name);

  return (
    <div className="space-y-6 text-[#0A2540]">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Real-Time Clinical Intelligence Hub
          </p>
          <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
            {greetingLine()}, {docName}
          </h1>
          <p className="text-pretty text-sm text-slate-600">
            Predictive, intelligent overview — risk, schedule, workload, clinical performance, and revenue in one
            place.
          </p>
          <p className="text-xs text-slate-500">
            Connect EMR, scheduling, and billing feeds to populate live metrics. Until then, capabilities below describe
            what will activate.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button className="gap-2 bg-[#0A2540] text-white hover:bg-[#0A2540]/90">
                    <Stethoscope className="h-4 w-4" />
                    Start consult
                  </Button>
                }
              />
              <TooltipContent>Jump into the next booked visit or start ad-hoc</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" className="gap-2 border-slate-300 bg-white text-[#0A2540] hover:bg-slate-50">
                    <FileText className="h-4 w-4 text-[#00C2A8]" />
                    Add notes
                  </Button>
                }
              />
              <TooltipContent>Capture a quick clinical note in under 10 seconds</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools in this hub</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overviewHubTools.map((cap) => (
            <AiCapabilityCard key={cap.id} capability={cap}>
              {cap.id === 'risk-radar' && (
                <LiveOutputPlaceholder>
                  No urgent follow-up queue yet. When risk signals fire, a count like “N patients need attention
                  today” will appear here.
                </LiveOutputPlaceholder>
              )}
              {cap.id === 'briefing' && (
                <LiveOutputPlaceholder>
                  Morning briefing will list today&apos;s appointments, critical cases, and follow-ups once your
                  schedule is linked.
                </LiveOutputPlaceholder>
              )}
              {cap.id === 'workload' && (
                <LiveOutputPlaceholder>
                  Inflow and duration forecasts will display after enough historical visits are available.
                </LiveOutputPlaceholder>
              )}
              {cap.id === 'performance' && (
                <LiveOutputPlaceholder>
                  Recovery and accuracy trends will chart here when outcomes and coding data are connected.
                </LiveOutputPlaceholder>
              )}
              {cap.id === 'revenue' && (
                <LiveOutputPlaceholder>
                  Day/week earnings projections and missed billing hints need a billing feed — figures will show as —
                  until then.
                </LiveOutputPlaceholder>
              )}
            </AiCapabilityCard>
          ))}
        </div>
      </div> */}

      <Card className="border-[#00C2A8]/25 bg-[#00C2A8]/[0.06] shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#0A2540]">
            <Cpu className="h-5 w-5 text-[#00C2A8]" aria-hidden />
            Cross-dashboard AI layer
          </CardTitle>
          <CardDescription>Unified brain behind every doctor surface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <ul className="list-inside list-disc space-y-1.5 text-xs leading-relaxed">
            {unifiedAiLayerBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="rounded-lg border border-slate-200/80 bg-white/80 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">How it connects</p>
            <ul className="mt-2 space-y-2 text-xs">
              {dashboardConnections.map((row) => (
                <li key={row.from}>
                  <span className="font-semibold text-[#0A2540]">{row.from}</span>
                  <span className="text-slate-600"> — {row.to}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
