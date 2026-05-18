'use client';

import { useEffect, useState } from 'react';
import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientSettingsTools } from '@/lib/patient-ai-capabilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';

type PatientProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
};

export default function PatientSettingsPage() {
  const [form, setForm] = useState<PatientProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to load profile');
          return;
        }
        setForm({
          name: data.profile.name ?? '',
          email: data.profile.email ?? '',
          phone: data.profile.phone ?? '',
          address: data.profile.address ?? '',
          gender: data.profile.gender ?? '',
          dateOfBirth: data.profile.dateOfBirth ?? '',
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save profile');
        return;
      }
      setMessage('Profile updated successfully.');
    } catch {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PatientAiModuleSection
        eyebrow="Settings"
        title="AI Personalization Engine"
        description="Preference learning, consent guidance, smart notifications, and behavioral insights — always under your control."
        tools={patientSettingsTools}
      />

      <h2 className="text-2xl font-bold text-[#0A2540]">Profile</h2>

      <Card className="border-slate-200/90 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Keep your patient profile up to date for smoother appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSave}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={loading || saving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                disabled={loading || saving}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                disabled={loading || saving}
                placeholder="Female / Male / Other"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                disabled={loading || saving}
                placeholder="Your current address"
                className="min-h-[96px]"
              />
            </div>

            {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
            {message && <p className="text-sm text-green-700 md:col-span-2">{message}</p>}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading || saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PatientCrossAiLayer />
    </div>
  );
}
