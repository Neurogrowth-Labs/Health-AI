import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Clock, User } from 'lucide-react';

export default function DoctorVirtualPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Virtual Consultations</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled virtual consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming sessions.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Recent Consultations
            </CardTitle>
            <CardDescription>Past virtual chat sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No past consultations yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-3xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
