'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  HeartPulse,
  Shield,
  Video,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    color: 'bg-teal-500/10 text-teal-600',
    title: 'Easy Booking',
    description:
      'Schedule virtual or physical appointments with top-rated doctors — pick a slot in under a minute.',
  },
  {
    icon: Bot,
    color: 'bg-sky-500/10 text-sky-600',
    title: 'AI Assistance',
    description:
      'Free preliminary AI consultations tailored to your symptoms, powered by the latest medical models.',
  },
  {
    icon: Video,
    color: 'bg-purple-500/10 text-purple-600',
    title: 'Virtual Care',
    description:
      'Connect securely with doctors via paid virtual chat — HD video, live notes, and prescriptions included.',
  },
  {
    icon: Shield,
    color: 'bg-emerald-500/10 text-emerald-600',
    title: 'Private & Secure',
    description:
      'Your health data stays yours. End-to-end encrypted, HIPAA-aligned, and never sold to third parties.',
  },
  {
    icon: Zap,
    color: 'bg-amber-500/10 text-amber-600',
    title: 'Instant Results',
    description:
      'Lab reports, prescriptions, and AI insights delivered to your dashboard — no waiting rooms.',
  },
  {
    icon: HeartPulse,
    color: 'bg-rose-500/10 text-rose-600',
    title: 'Continuous Monitoring',
    description:
      'Track vitals, risk scores, and health trends over time with your personal health command center.',
  },
];

const stats = [
  { value: '10K+', label: 'Patients served' },
  { value: '500+', label: 'Verified doctors' },
  { value: '98%', label: 'Satisfaction rate' },
  { value: '24/7', label: 'AI availability' },
];

const steps = [
  { step: '01', title: 'Create your account', body: 'Sign up in seconds — no insurance card required.' },
  { step: '02', title: 'Find your doctor', body: 'Browse specialists, read bios, and filter by availability.' },
  { step: '03', title: 'Book or chat', body: 'Reserve a slot or start a free AI consult right away.' },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const path =
        user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
      router.replace(path);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A2540]">
        <HeartPulse className="h-10 w-10 animate-pulse text-[#00C2A8]" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0A2540] px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00C2A8]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00C2A8]/30 bg-[#00C2A8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">
            <HeartPulse className="h-3.5 w-3.5" />
            AI-Powered Healthcare
          </span>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Healthcare from{' '}
            <span className="bg-gradient-to-r from-[#00C2A8] to-sky-400 bg-clip-text text-transparent">
              anywhere, anytime
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg lg:text-xl">
            Health AI connects you with expert doctors instantly. Book appointments, ask our AI
            assistant, and get virtual consultations — all from one dashboard.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="gap-2 rounded-full bg-[#00C2A8] text-[#0A2540] hover:bg-[#00C2A8]/90 font-bold px-8"
            >
              Get Started — it&apos;s free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/sign-in')}
              className="gap-2 rounded-full border-white bg-transparent text-white hover:bg-white/10 hover:text-white px-8"
            >
              Login
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            No credit card required &middot; Free AI consultations &middot; Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-8 text-center">
              <span className="text-3xl font-extrabold text-[#0A2540]">{value}</span>
              <span className="mt-1 text-sm text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[#F5F7FA] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">Why Health AI</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0A2540] sm:text-4xl">
              Everything you need in one place
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              From your first symptom to your follow-up, every tool is built into a single, intelligent platform.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, color, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0A2540]">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0A2540] sm:text-4xl">
              Up and running in 3 steps
            </h2>
          </div>

          <div className="relative grid gap-10 md:grid-cols-3">
            {/* connector line on md+ */}
            <div className="absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#00C2A8]/30 to-transparent md:block" />

            {steps.map(({ step, title, body }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A2540] text-sm font-bold text-[#00C2A8] ring-4 ring-white">
                  {step}
                </span>
                <h3 className="mb-2 text-base font-bold text-[#0A2540]">{title}</h3>
                <p className="text-sm text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-[#0A2540] via-[#0d2d4a] to-[#0A2540] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex flex-wrap justify-center gap-3 text-sm text-slate-300">
            {['No insurance needed', 'Cancel anytime', 'HIPAA-aligned'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00C2A8]" />
                {t}
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to take control of your health?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-300">
            Join thousands of patients and doctors already using Health AI every day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="gap-2 bg-[#00C2A8] text-[#0A2540] hover:bg-[#00C2A8]/90 font-bold px-8"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => router.push('/auth/sign-in')}
              className="text-white hover:bg-white/10 hover:text-white px-8"
            >
              I already have an account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
