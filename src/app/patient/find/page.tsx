'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientFindDoctorTools } from '@/lib/patient-ai-capabilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Video, CalendarPlus, Loader2 } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  practice: string | null;
  virtualChatFee: number | null;
}

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const practices = [...new Set(doctors.map((d) => d.practice).filter(Boolean))] as string[];

  const filteredDoctors =
    practiceFilter && practiceFilter !== 'all'
      ? doctors.filter((d) => d.practice === practiceFilter)
      : doctors;

  return (
    <div className="space-y-8">
      <PatientAiModuleSection
        eyebrow="Find a doctor"
        title="AI Matchmaking Engine"
        description="Semantic search, personalized recommendations, and trust-aware ranking help you pick the right clinician — not just the nearest name on a list."
        tools={patientFindDoctorTools}
      />

      <Card className="border-slate-200/90 shadow-md">
        <CardHeader>
          <CardTitle>Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={practiceFilter} onValueChange={setPracticeFilter}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Filter by practice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Practices</SelectItem>
                {practices.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Practice</TableHead>
                  <TableHead>Virtual Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>
                      {doctor.practice ? (
                        <Badge variant="secondary">{doctor.practice}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doctor.virtualChatFee ? (
                        <span className="font-medium">${doctor.virtualChatFee}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert('Book physical appointment feature coming soon.')}
                        >
                          <CalendarPlus className="h-4 w-4 mr-2" /> Book
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/patient/virtual?docId=${doctor.id}`)}
                        >
                          <Video className="h-4 w-4 mr-2" /> Virtual Chat
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No doctors found for this practice.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PatientCrossAiLayer />
    </div>
  );
}
