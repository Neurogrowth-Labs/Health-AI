'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Headphones, Lock, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-white">
      {/* flex-1 so short pages fill the viewport; footer stays at bottom */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left — brand / trust (half width on lg) */}
        <section
          className="relative flex shrink-0 flex-col justify-end overflow-hidden bg-gradient-to-br from-sky-100 via-white to-teal-50 px-6 pb-10 pt-12 sm:px-10 lg:w-1/2 lg:min-h-0 lg:justify-center lg:pb-16 lg:pt-16"
          aria-label="Security and product overview"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            aria-hidden
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='none' stroke='%230ea5e9' stroke-width='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: '72px 72px',
            }}
          />
          <svg
            className="pointer-events-none absolute -left-6 top-8 h-32 w-64 text-sky-400/30 sm:h-40 sm:w-80 lg:top-1/4"
            viewBox="0 0 200 80"
            fill="none"
            aria-hidden
          >
            <path
              d="M0 40 Q25 10 50 40 T100 40 T150 40 T200 40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="pointer-events-none absolute -right-16 top-1/4 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-10 bottom-20 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-white/70 px-3 py-1.5 text-xs font-medium text-teal-900 shadow-sm backdrop-blur-sm">
              <Shield className="h-4 w-4 text-teal-600" aria-hidden />
              Secure &amp; HIPAA-oriented
            </div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Care that meets you where you are
            </h1>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
              We use industry-standard encryption and follow healthcare privacy best practices to keep
              your information protected—so you can focus on your health.
            </p>
          </div>
        </section>

        {/* Right — form */}
        <section className="flex min-h-0 flex-1 flex-col bg-white lg:w-1/2 lg:shadow-[inset_1px_0_0_theme(colors.slate.200/0.6)]">
          <div className="flex flex-1 flex-col px-6 py-10 sm:px-10 lg:justify-center lg:px-14 lg:py-14">
            <div className="mx-auto w-full max-w-[440px]">{children}</div>
          </div>
        </section>
      </div>

      <footer className="shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-start gap-2 text-xs text-slate-600 sm:max-w-md sm:items-center">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sky-600/80 sm:mt-0" aria-hidden />
            <span>We respect your privacy and protect your health information.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <Link href="/terms" className="transition-colors hover:text-slate-900">
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <Link href="/privacy" className="transition-colors hover:text-slate-900">
              Privacy &amp; HIPAA
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Headphones className="h-4 w-4 text-sky-600/80" aria-hidden />
            <span>
              <span className="font-medium text-slate-700">Support</span> v2.4.1
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
