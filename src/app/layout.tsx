import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { AppChrome } from '@/components/AppChrome';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

export const metadata: Metadata = {
  title: 'Africa AI Health',
  description: 'Intelligent health infrastructure for Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body suppressHydrationWarning>
        <TooltipProvider>
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
