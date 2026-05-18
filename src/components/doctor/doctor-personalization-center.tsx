'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DoctorToggle } from '@/components/doctor/doctor-toggle';
import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import { settingsPersonalizationTools, unifiedAiLayerBullets } from '@/lib/doctor-ai-capabilities';
import { cn } from '@/lib/utils';
import {
  Bell,
  Brain,
  Briefcase,
  Cpu,
  DollarSign,
  FileText,
  Lock,
  Mic,
  User,
} from 'lucide-react';

type DoctorProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  practice: string;
  bio: string;
  virtualChatFee: number;
};

type SettingsSection = 'profile' | 'ai' | 'notifications' | 'privacy';

const nav: { id: SettingsSection; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'ai', label: 'AI preferences', icon: Brain },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
];

export default function DoctorPersonalizationCenter() {
  const [section, setSection] = useState<SettingsSection>('profile');
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

  const [aiDiagnosis, setAiDiagnosis] = useState(true);
  const [aiAssistLevel, setAiAssistLevel] = useState(55);
  const [voiceNotes, setVoiceNotes] = useState(true);
  const [alertHighRisk, setAlertHighRisk] = useState(true);
  const [alertRoutine, setAlertRoutine] = useState(false);
  const [shareDeIdentified, setShareDeIdentified] = useState(false);
  const [shareQuality, setShareQuality] = useState(true);

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
    <div className="space-y-6 text-[#0A2540]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</p>
        <h1 className="text-2xl font-bold">AI Personalization &amp; Control Center</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tune how AI assists you — personalization shapes every doctor dashboard.
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left nav */}
        <nav
          className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-1 lg:w-52 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
          aria-label="Settings sections"
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  active
                    ? 'border-[#00C2A8]/40 bg-[#00C2A8]/10 text-[#0A2540]'
                    : 'border-transparent bg-white/80 text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]',
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-[#00C2A8]' : 'text-slate-500')} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Main panel */}
        <div className="min-w-0 flex-1 space-y-6">
          {section === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200/90 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <User className="h-5 w-5 text-[#00C2A8]" />
                      Personal information
                    </CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
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
                      <Input id="email" type="email" value={form.email} disabled className="font-mono text-sm" />
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

                <Card className="border-slate-200/90 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <Briefcase className="h-5 w-5 text-[#00C2A8]" />
                      Practice details
                    </CardTitle>
                    <CardDescription>Your specialty and practice information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="practice">Practice / specialty</Label>
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

                <Card className="border-slate-200/90 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <DollarSign className="h-5 w-5 text-[#00C2A8]" />
                      Virtual chat
                    </CardTitle>
                    <CardDescription>Configure virtual consultation fees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fee">Virtual chat fee ($)</Label>
                      <Input
                        id="fee"
                        type="number"
                        value={form.virtualChatFee}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, virtualChatFee: Number(e.target.value || 0) }))
                        }
                        min={0}
                        disabled={loading || saving}
                        className="font-mono"
                      />
                    </div>
                    <p className="text-sm text-slate-600">
                      Fee for a 30-minute virtual consultation (demo — stored with your profile).
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/90 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <FileText className="h-5 w-5 text-[#00C2A8]" />
                      Credentials
                    </CardTitle>
                    <CardDescription>Licenses and certifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Credential verification coming soon.</p>
                  </CardContent>
                </Card>
              </div>

              {(error || message) && (
                <div className="space-y-1">
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {message && <p className="text-sm text-emerald-700">{message}</p>}
                </div>
              )}

              <Separator />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || saving}
                  className="bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
                >
                  {saving ? 'Saving...' : 'Save profile'}
                </Button>
              </div>
            </form>
          )}

          {section === 'ai' && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {settingsPersonalizationTools.map((cap) => (
                    <AiCapabilityCard key={cap.id} capability={cap}>
                      <p className="text-xs text-slate-500">
                        Controls below tune how aggressively these behaviors apply across Overview, Availability,
                        Virtual, and Records.
                      </p>
                    </AiCapabilityCard>
                  ))}
                </div>
              </div>

              <Card className="border-[#00C2A8]/25 bg-[#00C2A8]/10 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Cpu className="h-5 w-5 text-[#00C2A8]" aria-hidden />
                    Unified AI brain
                  </CardTitle>
                  <CardDescription>Shared services behind all doctor experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                    {unifiedAiLayerBullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-200/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Your controls</CardTitle>
                  <CardDescription>Clinical nudges, automation depth, and voice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DoctorToggle
                    id="ai-dx"
                    checked={aiDiagnosis}
                    onCheckedChange={setAiDiagnosis}
                    label="Enable AI diagnosis suggestions"
                    description="Surfaced in visits and chart review — never auto-applied."
                  />
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-medium">AI assistance stance</Label>
                      <span className="font-mono text-xs text-slate-600">{aiAssistLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiAssistLevel}
                      onChange={(e) => setAiAssistLevel(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer accent-[#00C2A8]"
                    />
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Mic className="h-5 w-5 text-[#00C2A8]" />
                    Voice
                  </CardTitle>
                  <CardDescription>Capture notes hands-free</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DoctorToggle
                    id="voice-notes"
                    checked={voiceNotes}
                    onCheckedChange={setVoiceNotes}
                    label="Enable voice notes"
                    description="Streams to Live Notes with PHI-aware handling."
                  />
                  <div className="space-y-2">
                    <Label htmlFor="lang">Language</Label>
                    <select
                      id="lang"
                      className="flex h-9 w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 text-sm text-[#0A2540] outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8]/40"
                      defaultValue="en-US"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {section === 'notifications' && (
            <Card className="border-slate-200/90 shadow-md">
              <CardHeader>
                <CardTitle className="text-base font-bold">Notifications</CardTitle>
                <CardDescription>Priority routing for operational vs. clinical alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DoctorToggle
                  id="alert-risk"
                  checked={alertHighRisk}
                  onCheckedChange={setAlertHighRisk}
                  label="High-risk patient alerts"
                  description="Push + in-app when risk radar flags critical changes."
                />
                <Separator />
                <DoctorToggle
                  id="alert-routine"
                  checked={alertRoutine}
                  onCheckedChange={setAlertRoutine}
                  label="Routine updates"
                  description="Scheduling, billing, and product announcements."
                />
              </CardContent>
            </Card>
          )}

          {section === 'privacy' && (
            <div className="space-y-6">
              <Card className="border-slate-200/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Data sharing</CardTitle>
                  <CardDescription>What leaves your workspace for model improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DoctorToggle
                    id="share-deid"
                    checked={shareDeIdentified}
                    onCheckedChange={setShareDeIdentified}
                    label="Share de-identified prompts for tuning"
                    description="No PHI — approved snippets only, contractually bound."
                  />
                  <Separator />
                  <DoctorToggle
                    id="share-quality"
                    checked={shareQuality}
                    onCheckedChange={setShareQuality}
                    label="Participate in quality benchmarking"
                    description="Aggregate outcomes vs. anonymous peer cohorts."
                  />
                </CardContent>
              </Card>
              <Card className="border-slate-200/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Access logs</CardTitle>
                  <CardDescription>Who touched this account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p className="text-sm">No access log entries yet.</p>
                  <Button variant="outline" size="sm" className="mt-1 border-slate-300" type="button" disabled>
                    Export full log
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
