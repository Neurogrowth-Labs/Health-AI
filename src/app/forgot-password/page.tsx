'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import logoHealthAi from '@/assets/logo-healthai.png';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }
      setOtpSent(true);
      setMessage(data.message || 'OTP sent. Check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }
      setMessage('Password reset successful. Redirecting to sign in...');
      setTimeout(() => router.push('/auth/sign-in'), 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <Card className="rounded-[22px] border border-sky-100/80 bg-white/90 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.2)] backdrop-blur-md sm:rounded-3xl">
        <CardHeader className="space-y-4 pb-2 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
              <Image
                src={logoHealthAi}
                alt=""
                width={56}
                height={56}
                className="object-contain p-1.5"
                priority
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Forgot password
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                {!otpSent ? 'Enter your email and we will send a one-time code.' : 'Enter the code and choose a new password.'}
              </CardDescription>
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-800"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Secure reset flow
            </Badge>
          </div>
        </CardHeader>

        <form onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
          <CardContent className="space-y-5 px-6 pb-6 pt-2 sm:px-8">
            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200/80 bg-red-50/90 text-red-900"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && !error && (
              <Alert className="rounded-xl border-emerald-200/80 bg-emerald-50/90 text-emerald-900">
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500/80" aria-hidden />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={otpSent}
                  className="h-11 rounded-xl border-sky-100/80 bg-sky-50/40 pl-10"
                />
              </div>
            </div>

            {otpSent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-800">
                    OTP code
                  </Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="h-11 rounded-xl border-sky-100/80 bg-sky-50/40 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-800">
                    New password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-sky-100/80 bg-sky-50/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-800">
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-sky-100/80 bg-sky-50/40"
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8 pt-0 sm:px-8">
            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Please wait…
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" aria-hidden />
                  {otpSent ? 'Reset password' : 'Send OTP'}
                </>
              )}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Back to{' '}
              <Link href="/auth/sign-in" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
