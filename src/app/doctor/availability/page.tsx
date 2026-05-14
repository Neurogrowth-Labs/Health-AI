import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AvailabilityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-600 mb-4">Set your 30-minute interval slots for physical appointments.</div>
        <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
          <p className="text-center text-slate-500">Availability calendar interface would go here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
