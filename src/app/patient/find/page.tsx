'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Video, CalendarPlus, Loader2 } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  practice: string | null;
  virtualChatFee: number | null;
}

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [practiceFilter, setPracticeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data.doctors || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const practices = [...new Set(doctors.map(d => d.practice).filter(Boolean))];

  const filteredDoctors = practiceFilter
    ? doctors.filter(d => d.practice === practiceFilter)
    : doctors;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <select 
              className="flex h-10 w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={practiceFilter}
              onChange={(e) => setPracticeFilter(e.target.value)}
            >
              <option value="">All Practices</option>
              {practices.map(p => (
                <option key={p} value={p!}>{p}</option>
              ))}
            </select>
          </div>

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
              {filteredDoctors.map(doctor => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.practice}</TableCell>
                  <TableCell>${doctor.virtualChatFee}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => alert('Book physical appointment feature coming soon.')}>
                        <CalendarPlus className="h-4 w-4 mr-2" /> Book
                      </Button>
                      <Button size="sm" onClick={() => router.push(`/patient/virtual?docId=${doctor.id}`)}>
                        <Video className="h-4 w-4 mr-2" /> Virtual Chat
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDoctors.length === 0 && (
                <TableRow>
                  <TableCell className="text-center py-6 text-slate-500">
                    No doctors found for this practice.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
