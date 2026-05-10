import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { MessageSquare, Video, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_DOCTORS = [
  { id: '2', name: 'Dr. Sarah Jenkins', practice: 'Cardiology', virtualChatFee: 50 },
  { id: '10', name: 'Dr. Mike Ross', practice: 'Dermatology', virtualChatFee: 30 },
  { id: '11', name: 'Dr. Emily Chen', practice: 'Neurology', virtualChatFee: 75 },
];

export default function FindDoctors() {
  const [practiceFilter, setPracticeFilter] = useState('');
  const navigate = useNavigate();

  const filteredDoctors = practiceFilter
    ? MOCK_DOCTORS.filter(d => d.practice === practiceFilter)
    : MOCK_DOCTORS;

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
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
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
                      <Button size="sm" onClick={() => navigate(`/patient/virtual?docId=${doctor.id}`)}>
                        <Video className="h-4 w-4 mr-2" /> Virtual Chat
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDoctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-500">
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
