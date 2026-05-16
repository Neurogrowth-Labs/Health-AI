'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';

type DashboardNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

interface DashboardShellProps {
  portalLabel: string;
  userLabel?: string;
  pathname: string;
  navItems: DashboardNavItem[];
  activeItemClassName: string;
  inactiveItemClassName: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  portalLabel,
  userLabel,
  pathname,
  navItems,
  activeItemClassName,
  inactiveItemClassName,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const rootPath = navItems[0]?.path ?? '';

  const handleLogout = async () => {
    await logout();
    router.push('/auth/sign-in');
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="floating" className="top-16 h-[calc(100svh-4rem)]">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="px-2 py-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/70">
              {portalLabel}
            </p>
            {userLabel && <p className="mt-1 truncate text-sm font-semibold text-sidebar-foreground">{userLabel}</p>}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== rootPath && pathname.startsWith(item.path));
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn('font-medium', isActive ? activeItemClassName : inactiveItemClassName)}
                      render={<Link href={item.path} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 data-active:bg-red-50 data-active:text-red-700"
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 bg-transparent md:pl-1">
        <div className="w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
