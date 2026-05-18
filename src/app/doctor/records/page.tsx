'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import { dashboardConnections, emrTools } from '@/lib/doctor-ai-capabilities';
import { Search, Upload } from 'lucide-react';

export default function PatientRecordsPage() {
  return (
    <div className="space-y-4 text-[#0A2540]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Records</p>
          <h1 className="text-2xl font-bold">AI-Powered EMR Intelligence System</h1>
          <p className="mt-1 text-sm text-slate-600">
            Summary, longitudinal analysis, risk, decision support, and document intelligence — before you open a
            chart.
          </p>
        </div>
        <div className="mt-2 flex gap-2 sm:mt-0">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search patients…" className="h-9 pl-9 font-mono text-sm" />
          </div>
          <Button type="button" variant="outline" className="shrink-0 border-slate-300">
            Find
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {emrTools.map((cap) => (
            <AiCapabilityCard key={cap.id} capability={cap}>
              <p className="text-center text-xs text-slate-500">
                Patient-specific output appears after search and EMR link.
              </p>
            </AiCapabilityCard>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        <span className="font-semibold text-[#0A2540]">Integration:</span>{' '}
        {dashboardConnections.find((c) => c.from === 'Patient records')?.to}
      </p>

      <Card className="overflow-hidden border-slate-200/90 shadow-md">
        <CardContent className="p-4 sm:p-5">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            Search for a patient to load the smart summary, timeline, insights, and uploads for that chart.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <Card className="flex-1 border-slate-200/90 shadow-md">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold">Clinical timeline</CardTitle>
            <p className="text-xs text-slate-600">Visits · Prescriptions · Tests</p>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-8 text-center text-sm text-slate-500">
              No timeline entries. Open a patient record to see visits and orders.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full shrink-0 border-slate-200/90 shadow-md lg:w-80">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold">AI insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-6 text-center text-sm text-slate-500">
              Insights will appear after clinical data is available for the selected patient.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/90 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold">Documents</CardTitle>
          <Button type="button" size="sm" variant="outline" className="gap-1 border-slate-300">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="rounded-lg border border-dashed border-slate-300/80 bg-slate-50/50 px-3 py-8 text-center text-sm text-slate-500">
            No documents yet. Upload files or connect an EHR import — document intelligence will extract key fields.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
