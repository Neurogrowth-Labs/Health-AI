'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, Activity, Settings, DollarSign } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const navItems = [
  { label: 'Overview', path: '/admin', icon: Activity },
  { label: 'Manage Users', path: '/admin/users', icon: Users },
  { label: 'Payments', path: '/admin/payments', icon: DollarSign },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardShell
        portalLabel="Admin Portal"
        userLabel={user?.name}
        pathname={pathname}
        navItems={navItems}
        activeItemClassName="bg-slate-900 text-white"
        inactiveItemClassName="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
