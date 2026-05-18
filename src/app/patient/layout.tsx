'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  LayoutDashboard,
  Search,
  Video,
  FileText,
  Settings,
  CalendarClock,
  MessageSquare,
} from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const navItems = [
  { label: 'Overview', path: '/patient', icon: LayoutDashboard },
  { label: 'AI Copilot', path: '/patient/ai-chat', icon: MessageSquare },
  { label: 'Find Doctors', path: '/patient/find', icon: Search },
  { label: 'Appointments', path: '/patient/appointments', icon: CalendarClock },
  { label: 'Virtual Consults', path: '/patient/virtual', icon: Video },
  { label: 'Documents', path: '/patient/documents', icon: FileText },
  { label: 'Settings', path: '/patient/settings', icon: Settings },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardShell
        portalLabel="Patient Portal"
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
