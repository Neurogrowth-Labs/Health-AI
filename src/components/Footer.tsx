'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const pathname = usePathname() ?? '';
  const isAuthShell =
    pathname.startsWith('/auth/') || pathname.startsWith('/forgot-password');

  if (isAuthShell) {
    return null;
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
            <span className="font-medium text-primary">Support</span> v2.4.1
          </p>
        </div>
      </div>
    </footer>
  );
}
