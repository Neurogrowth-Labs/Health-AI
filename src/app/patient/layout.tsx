'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Calendar, MessageSquare, Video, FileText, Search, Settings } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const navItems = [
  { label: 'Overview', path: '/patient', icon: Calendar },
  { label: 'Find Doctors', path: '/patient/find', icon: Search },
  // { label: 'AI Chat', path: '/patient/ai-chat', icon: MessageSquare },
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
        userLabel={user?.name ? `Welcome, ${user.name}` : undefined}
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
