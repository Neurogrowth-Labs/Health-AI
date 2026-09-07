'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const pathname = usePathname() ?? '';
  const isAuthShell =
    pathname.startsWith('/auth/') || pathname.startsWith('/forgot-password');

  const isLandingPage = pathname === '/';

  if (isAuthShell) {
    return null;
  }

  if (isLandingPage) {
    return (
      <footer className="bg-[#071A2B] px-5 py-10 text-slate-400 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">Africa <span className="text-[#55cfc0]">AI Health</span></p>
            <p className="mt-1 text-xs">One intelligent health infrastructure.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <span>© {new Date().getFullYear()} Health AI</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy &amp; HIPAA
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">Support</span> v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
