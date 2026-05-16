'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Calendar, Video, FileText, Settings, Clock } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

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
      <DashboardShell
        portalLabel="Doctor Portal"
        userLabel={user?.name}
        pathname={pathname}
        navItems={navItems}
        activeItemClassName="bg-blue-50 text-blue-700"
        inactiveItemClassName="text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
