'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LayoutDashboard, Video, FileText, Settings, Clock } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const navItems = [
  { label: 'Overview', path: '/doctor', icon: LayoutDashboard },
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
      <DashboardShell
        portalLabel="Doctor Portal"
        userLabel={user?.name}
        pathname={pathname}
        navItems={navItems}
        brandLogo="/logo-healthai.png"
        activeItemClassName="border border-sky-200/70 bg-sky-100/80 text-sky-950 shadow-sm"
        inactiveItemClassName="text-slate-600 hover:bg-sky-50/70 hover:text-slate-900"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
