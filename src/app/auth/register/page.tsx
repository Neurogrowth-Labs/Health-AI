'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  User,
  Stethoscope,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import logoHealthAi from '@/assets/logo-healthai.png';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const result = await register(name, email, password, role);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <AuthShell>
      <Card className="border-white/70 bg-white/85 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.2)] backdrop-blur-md rounded-[22px] sm:rounded-3xl">
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
                Create your account
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Join Health AI in under a minute and start your digital care journey.
              </CardDescription>
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-800"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Secure &amp; HIPAA Compliant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8 pt-2 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200/80 bg-red-50/90 text-red-900"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-800">
                Full name
              </Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70"
                  aria-hidden
                />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-slate-200/90 bg-sky-50/40 pl-11 pr-3.5 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-sky-400/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70"
                  aria-hidden
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-slate-200/90 bg-sky-50/40 pl-11 pr-3.5 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-sky-400/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-800">I am a</Label>
              <Tabs value={role} onValueChange={(v) => setRole(v as 'PATIENT' | 'DOCTOR')}>
                <TabsList className="h-12 w-full rounded-xl border border-slate-200/80 bg-sky-50/50 p-1">
                  <TabsTrigger value="PATIENT" className="flex-1 gap-2 rounded-lg" disabled={isLoading}>
                    <User className="h-4 w-4" />
                    Patient
                  </TabsTrigger>
                  <TabsTrigger value="DOCTOR" className="flex-1 gap-2 rounded-lg" disabled={isLoading}>
                    <Stethoscope className="h-4 w-4" />
                    Doctor
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-800">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70"
                  aria-hidden
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-slate-200/90 bg-sky-50/40 pl-11 pr-12 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-sky-400/40"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-800">
                Confirm password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70"
                  aria-hidden
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-slate-200/90 bg-sky-50/40 pl-11 pr-12 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-sky-400/40"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:from-sky-600 hover:to-teal-600 hover:shadow-xl hover:shadow-sky-500/30"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </Button>

            <div className="flex items-center gap-3 py-1">
              <Separator className="flex-1 bg-slate-200/90" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Or</span>
              <Separator className="flex-1 bg-slate-200/90" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-200 bg-white/90 text-slate-800 shadow-sm hover:bg-slate-50"
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-sky-600 transition-colors hover:text-sky-800 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
