'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, DollarSign, Briefcase, FileText } from 'lucide-react';

type DoctorProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  practice: string;
  bio: string;
  virtualChatFee: number;
};

export default function DoctorSettingsPage() {
  const [form, setForm] = useState<DoctorProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    practice: '',
    bio: '',
    virtualChatFee: 0,
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
          practice: data.profile.practice ?? '',
          bio: data.profile.bio ?? '',
          virtualChatFee: Number(data.profile.virtualChatFee ?? 0),
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Complete Your Professional Profile</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  disabled={loading || saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Practice Details
              </CardTitle>
              <CardDescription>Your specialty and practice information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="practice">Practice/Specialty</Label>
                <Input
                  id="practice"
                  value={form.practice}
                  onChange={(e) => setForm((prev) => ({ ...prev, practice: e.target.value }))}
                  disabled={loading || saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell patients about your experience and expertise..."
                  className="min-h-[100px]"
                  disabled={loading || saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Virtual Chat Settings
              </CardTitle>
              <CardDescription>Configure your virtual consultation fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fee">Virtual Chat Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  value={form.virtualChatFee}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, virtualChatFee: Number(e.target.value || 0) }))
                  }
                  min={0}
                  disabled={loading || saving}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This is the fee patients will pay for a 30-minute virtual consultation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Credentials
              </CardTitle>
              <CardDescription>Your medical licenses and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Credential verification coming soon.
              </p>
            </CardContent>
          </Card>
        </div>

        {(error || message) && (
          <div className="space-y-1">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}
          </div>
        )}

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
