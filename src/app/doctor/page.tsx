import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Video } from 'lucide-react';

export default function DoctorOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-500 text-center py-8">No appointments scheduled for today.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Upcoming Virtual Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-500 text-center py-8">No virtual chats scheduled.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
