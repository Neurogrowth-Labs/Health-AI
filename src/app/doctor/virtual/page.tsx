'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { virtualConsultTools } from '@/lib/doctor-ai-capabilities';
import {
  FileWarning,
  History,
  Mic,
  PenLine,
  PhoneOff,
  Save,
  Sparkles,
  User,
  Video,
  VolumeX,
} from 'lucide-react';

export default function DoctorVirtualPage() {
  const [notes, setNotes] = useState('');

  return (
    <div className="relative flex min-h-0 flex-col gap-4 pb-20 text-[#0A2540] lg:pb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telemedicine</p>
        <h1 className="text-2xl font-bold">AI-Augmented Telemedicine Suite</h1>
        <p className="mt-1 text-sm text-slate-600">
          Real-time assistance, transcription, overlays, and prescription support — layered on a single visit workspace.
        </p>
      </div>

      <Card className="border-slate-200/90 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">AI tools in this suite</CardTitle>
          <CardDescription>Advisory only until integrations and governance are configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {virtualConsultTools.map((cap) => (
              <div
                key={cap.id}
                className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 text-xs text-slate-600"
              >
                <p className="font-semibold text-[#0A2540]">{cap.title}</p>
                <ul className="mt-2 list-inside list-disc space-y-1 leading-snug">
                  {cap.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex min-h-[560px] flex-1 flex-col gap-4 lg:flex-row lg:gap-0 lg:rounded-xl lg:overflow-hidden lg:border lg:border-slate-200/90 lg:shadow-lg">
        <div className="flex flex-1 flex-col bg-slate-950 lg:min-w-0 lg:max-w-[52%]">
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A2540]">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-8 rounded-2xl border border-white/10 bg-black/20" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 text-center text-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-2 ring-[#00C2A8]/50">
                <User className="h-10 w-10 text-white/90" />
              </div>
              <p className="text-sm font-semibold">Patient video</p>
              <p className="font-mono text-xs text-white/60">No active session</p>
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      size="icon"
                      variant="secondary"
                      type="button"
                      className="h-10 w-10 rounded-full border-0 bg-white/15 text-white hover:bg-white/25"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>Mute microphone</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      size="icon"
                      variant="secondary"
                      type="button"
                      className="h-10 w-10 rounded-full border-0 bg-white/15 text-white hover:bg-white/25"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>Camera on/off</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button type="button" size="icon" variant="destructive" className="h-10 w-10 rounded-full">
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>End visit</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="px-3 py-2 text-center text-[10px] text-slate-400">
            Recording indicator — comply with state two-party consent rules.
          </p>
        </div>

        <div className="flex flex-1 flex-col border-t border-slate-200/90 bg-white lg:border-t-0 lg:border-l">
          <Tabs defaultValue="notes" className="flex min-h-0 flex-1 flex-col gap-0">
            <div className="border-b border-slate-100 px-3 pt-3">
              <TabsList variant="line" className="h-9 w-full justify-start gap-1">
                <TabsTrigger value="notes" className="gap-1.5 text-xs sm:text-sm">
                  <Mic className="h-3.5 w-3.5" />
                  Live notes
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-1.5 text-xs sm:text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#00C2A8]" />
                  AI assistant
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm">
                  <History className="h-3.5 w-3.5" />
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="notes" className="flex min-h-0 flex-1 flex-col overflow-hidden px-0 pt-0">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Live transcription → structured note
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Draft SOAP sections will stream here during an active visit when scribe is enabled.
                </p>
              </div>
              <textarea
                className="min-h-[220px] flex-1 resize-none border-0 bg-white px-4 py-3 font-mono text-sm text-[#0A2540] outline-none focus:ring-0"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Clinical notes stream here…"
              />
            </TabsContent>

            <TabsContent value="ai" className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <p className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-6 text-center text-sm text-slate-500">
                Real-time differentials and question prompts will populate when the visit session and NLP pipeline are
                connected.
              </p>
            </TabsContent>

            <TabsContent value="history" className="min-h-0 flex-1 overflow-y-auto px-4 py-4 text-sm">
              <p className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-6 text-center text-slate-500">
                Symptom overlay and historical risk factors appear once a patient is bound to this room.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-md lg:static lg:z-0 lg:rounded-xl lg:border lg:shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:justify-end">
          <Button type="button" variant="outline" className="gap-2 border-slate-300 text-[#0A2540]">
            <PenLine className="h-4 w-4 text-[#00C2A8]" />
            Generate prescription
          </Button>
          <Button type="button" className="gap-2 bg-[#0A2540] text-white hover:bg-[#0A2540]/90">
            <Save className="h-4 w-4" />
            Save notes
          </Button>
          <Button type="button" variant="secondary" className="gap-2 text-[#0A2540]">
            <FileWarning className="h-4 w-4 text-amber-600" />
            Flag case
          </Button>
        </div>
      </div>
    </div>
  );
}
