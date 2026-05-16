import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
            <div className="flex flex-col min-h-screen w-full font-sans text-slate-900 bg-[#F5F7FA] select-none">
              <Header />
              <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
