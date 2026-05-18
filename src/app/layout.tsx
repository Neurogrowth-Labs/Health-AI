import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { AppChrome } from '@/components/AppChrome';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Health AI',
  description: 'A comprehensive doctor appointment booking and consulting system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
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
