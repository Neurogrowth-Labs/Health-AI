'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientAppointmentTools } from '@/lib/patient-ai-capabilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { CalendarPlus, Loader2, Clock, MapPin, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeStr: string;
  type: 'PHYSICAL' | 'VIRTUAL';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes: string | null;
  createdAt: string;
}

interface Doctor {
  id: string;
  name: string;
  practice: string | null;
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [apptRes, docRes] = await Promise.all([
        fetch(`/api/appointments?patientId=${user.id}`),
        fetch('/api/doctors'),
      ]);

      if (apptRes.ok) {
        const data = await apptRes.json();
        setAppointments(data.appointments ?? []);
      }
      if (docRes.ok) {
        const data = await docRes.json();
        setDoctors(data.doctors ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDoctorName = (doctorId: string) => {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc?.name ?? 'Unknown Doctor';
  };

  const getDoctorPractice = (doctorId: string) => {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc?.practice ?? null;
  };

  // Sort: upcoming first, then by date desc
  const sorted = [...appointments].sort((a, b) => {
    const dateA = `${a.date}T${a.timeStr}`;
    const dateB = `${b.date}T${b.timeStr}`;
    return dateB.localeCompare(dateA);
  });

  const upcoming = sorted.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const past = sorted.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <div className="space-y-8 text-[#0A2540]">
      <PatientAiModuleSection
        eyebrow="Appointments"
        title="Predictive Scheduling System"
        description="Booking AI proposes optimal times and doctors; no-show prediction, wait-time optimization, and follow-up suggestions keep your care on track."
        tools={patientAppointmentTools}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Your Bookings</h2>
        <Button
          onClick={() => router.push('/patient/find')}
          className="gap-2 bg-teal-600 text-white hover:bg-teal-700"
        >
          <CalendarPlus className="h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Loading appointments...</span>
        </div>
      ) : appointments.length === 0 ? (
        <Card className="border-slate-200/90 shadow-md">
          <CardContent className="py-12">
            <p className="text-center text-sm text-slate-500">
              No appointments yet. Use <strong>Find Doctors</strong> to book your first visit.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <Card className="border-slate-200/90 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Clock className="h-4 w-4 text-teal-600" />
                  Upcoming ({upcoming.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcoming.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getDoctorName(appt.doctorId)}</p>
                            {getDoctorPractice(appt.doctorId) && (
                              <p className="text-xs text-slate-500">{getDoctorPractice(appt.doctorId)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{appt.date}</TableCell>
                        <TableCell className="font-mono text-sm">{appt.timeStr}</TableCell>
                        <TableCell>
                          {appt.type === 'VIRTUAL' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-purple-700">
                              <Video className="h-3.5 w-3.5" /> Virtual
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-sky-700">
                              <MapPin className="h-3.5 w-3.5" /> Physical
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[appt.status]}>
                            {appt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Past */}
          {past.length > 0 && (
            <Card className="border-slate-200/90 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base font-bold text-slate-500">
                  Past ({past.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {past.map((appt) => (
                      <TableRow key={appt.id} className="opacity-70">
                        <TableCell>
                          <p className="font-medium">{getDoctorName(appt.doctorId)}</p>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{appt.date}</TableCell>
                        <TableCell className="font-mono text-sm">{appt.timeStr}</TableCell>
                        <TableCell>
                          {appt.type === 'VIRTUAL' ? (
                            <span className="inline-flex items-center gap-1 text-sm">
                              <Video className="h-3.5 w-3.5" /> Virtual
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm">
                              <MapPin className="h-3.5 w-3.5" /> Physical
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[appt.status]}>
                            {appt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <PatientCrossAiLayer />
    </div>
  );
}
