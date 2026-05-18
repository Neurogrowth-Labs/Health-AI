'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function isFullBleedAuthPath(pathname: string) {
  return (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/forgot-password')
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const fullBleed = isFullBleedAuthPath(pathname);
  const isBrandedPortal = pathname.startsWith('/doctor') || pathname.startsWith('/patient');

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col font-sans text-slate-900',
        isBrandedPortal
          ? 'bg-gradient-to-b from-sky-50/70 via-[#F5F7FA] to-teal-50/40'
          : 'bg-[#F5F7FA]',
      )}
    >
      <Header />
      <main
        className={cn(
          'flex w-full flex-col',
          // Auth/forgot-password: let content define height so the document can scroll.
          // Dashboard routes need flex-1 + min-h-0 so shell layouts fill the viewport.
          fullBleed ? 'p-0' : 'min-h-0 flex-1 gap-6 p-4 sm:p-6 lg:p-8',
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
