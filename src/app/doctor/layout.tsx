'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Calendar, Video, FileText, Settings, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Overview', path: '/doctor', icon: Calendar },
  { label: 'Availability', path: '/doctor/availability', icon: Clock },
  { label: 'Virtual Consults', path: '/doctor/virtual', icon: Video },
  { label: 'Patient Records', path: '/doctor/records', icon: FileText },
  { label: 'Settings', path: '/doctor/settings', icon: Settings },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
            <div className="mb-6 px-2">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor Portal</h2>
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== '/doctor' && pathname.startsWith(item.path));
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
