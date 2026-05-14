'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DoctorSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Virtual Chat Fee ($)</label>
          <input type="number" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={50} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Practice/Specialty</label>
          <input type="text" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue="Cardiology" />
        </div>
        <button className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium mt-4">Save Changes</button>
      </CardContent>
    </Card>
  );
}
