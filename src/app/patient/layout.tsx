'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Calendar, MessageSquare, Video, FileText, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Overview', path: '/patient', icon: Calendar },
  { label: 'Find Doctors', path: '/patient/find', icon: Search },
  { label: 'AI Chat', path: '/patient/ai-chat', icon: MessageSquare },
  { label: 'Virtual Consults', path: '/patient/virtual', icon: Video },
  { label: 'Documents', path: '/patient/documents', icon: FileText },
  { label: 'Settings', path: '/patient/settings', icon: Settings },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
            <div className="mb-6 px-2">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Portal</h2>
              <p className="text-sm font-semibold text-slate-900">Welcome, {user?.name}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== '/patient' && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
