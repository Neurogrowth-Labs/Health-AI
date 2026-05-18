'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import {
  patientDashboardConnections,
  patientMicroserviceArchitecture,
  patientOverviewTools,
  patientUnifiedAiLayerBullets,
} from '@/lib/patient-ai-capabilities';
import { Bot, CalendarPlus, MessageSquare, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export function PatientCrossAiLayer() {
  return (
    <Card className="border-sky-200/70 bg-gradient-to-br from-sky-50/90 via-white to-teal-50/60 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700">
            <Bot className="h-5 w-5" aria-hidden />
          </span>
          Cross-dashboard AI layer
        </CardTitle>
        <CardDescription>
          Core systems that keep every module aligned with your history and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {patientUnifiedAiLayerBullets.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-sky-100/80 bg-white/80 p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-sky-950">{item.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PatientHealthCommandCenter() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.name?.trim() || 'there';

  return (
    <div className="flex min-h-0 flex-col gap-6 text-[#0A2540]">
      <div className="flex flex-col gap-4 rounded-xl border border-sky-100/90 bg-white/90 p-4 shadow-[0_14px_44px_-22px_rgba(14,165,233,0.14)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            AI Health Command Center
          </p>
          <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
            {greetingLine()}, {name}
          </h1>
          <p className="text-pretty text-sm text-slate-600">
            Your overview is powered by specialized AI microservices — copilot, health score, predictive risk, and
            smart alerts — orchestrated with your consent.
          </p>
          <ul className="list-inside list-disc text-xs text-slate-500">
            {patientMicroserviceArchitecture.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    className="gap-2 bg-sky-600 text-white hover:bg-sky-600/90"
                    onClick={() => router.push('/patient/ai-chat')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    AI Copilot
                  </Button>
                }
              />
              <TooltipContent>Chat-based health assistant</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-sky-200 bg-white text-sky-950 hover:bg-sky-50"
                    onClick={() => router.push('/patient/find')}
                  >
                    <Search className="h-4 w-4 text-teal-600" />
                    Find a doctor
                  </Button>
                }
              />
              <TooltipContent>AI matchmaking + semantic search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-sky-200 bg-white text-sky-950 hover:bg-sky-50"
                    onClick={() => router.push('/patient/appointments')}
                  >
                    <CalendarPlus className="h-4 w-4 text-teal-600" />
                    Appointments
                  </Button>
                }
              />
              <TooltipContent>Predictive scheduling</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Upcoming appointments', value: '—', hint: 'Smart booking + no-show AI' },
          { label: 'Active consults', value: '—', hint: 'Live assist + transcription' },
          { label: 'Documents processed', value: '—', hint: 'OCR & categorization' },
          { label: 'Health score', value: '—', hint: 'GET /ai/health-score' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-950">{kpi.value}</div>
              <p className="mt-1 text-[11px] text-slate-500">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools in this hub</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {patientOverviewTools.map((cap) => (
            <AiCapabilityCard key={cap.id} capability={cap}>
              {cap.id === 'copilot' && (
                <LiveOutputPlaceholder>
                  Connect chat history and vitals feeds to activate contextual copilot replies here.
                </LiveOutputPlaceholder>
              )}
              {cap.id === 'health-score' && (
                <LiveOutputPlaceholder>
                  Your dynamic score and preventative tips will render once vitals and behavior data sync.
                </LiveOutputPlaceholder>
              )}
            </AiCapabilityCard>
          ))}
        </div>
      </div> */}

      <Card className="border-slate-200/80 bg-slate-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">How modules connect</CardTitle>
          <CardDescription>Each screen below runs additional engines on the same patient graph.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-slate-600">
          {patientDashboardConnections.map((row) => (
            <p key={row.from}>
              <span className="font-semibold text-sky-900">{row.from}:</span> {row.to}
            </p>
          ))}
        </CardContent>
      </Card>

      <PatientCrossAiLayer />
    </div>
  );
}
