'use client';

import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientAppointmentTools } from '@/lib/patient-ai-capabilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Sparkles } from 'lucide-react';

export default function PatientAppointmentsPage() {
  return (
    <div className="space-y-8 text-[#0A2540]">
      <PatientAiModuleSection
        eyebrow="Appointments"
        title="Predictive Scheduling System"
        description="Booking AI proposes optimal times and doctors; no-show prediction, wait-time optimization, and follow-up suggestions keep your care on track."
        tools={patientAppointmentTools}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200/90 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-teal-600" />
              Smart suggestions
            </CardTitle>
            <CardDescription>Runs on POST /ai/appointment-suggestions when your account is linked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              Example output: ranked slots with urgency, travel, and wait-time signals — empty until scheduling data
              connects.
            </p>
            <Button type="button" variant="outline" className="border-sky-200 bg-white hover:bg-sky-50">
              Refresh suggestions
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarPlus className="h-5 w-5 text-sky-600" />
              Your bookings
            </CardTitle>
            <CardDescription>Upcoming visits will appear here from the scheduling service.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-500">
              No appointments yet. Use Find Doctors or Smart suggestions to book.
            </p>
          </CardContent>
        </Card>
      </div>

      <PatientCrossAiLayer />
    </div>
  );
}
