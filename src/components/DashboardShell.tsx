'use client';

import Link from 'next/link';
import type { StaticImageData } from 'next/image';
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
  /** Product mark — string should be a path under /public (e.g. /logo-healthai.png) for reliable loading */
  brandLogo?: StaticImageData | string;
  className?: string;
  /** Merged onto the floating sidebar surface */
  sidebarClassName?: string;
  /** Main content column behind pages */
  insetClassName?: string;
}

export default function DashboardShell({
  portalLabel,
  userLabel,
  pathname,
  navItems,
  activeItemClassName,
  inactiveItemClassName,
  children,
  brandLogo,
  className,
  sidebarClassName,
  insetClassName,
}: DashboardShellProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const rootPath = navItems[0]?.path ?? '';
  const brandLogoSrc =
    brandLogo === undefined ? undefined : typeof brandLogo === 'string' ? brandLogo : brandLogo.src;

  const handleLogout = async () => {
    await logout();
    router.push('/auth/sign-in');
  };

  return (
    <SidebarProvider defaultOpen className={className}>
      <Sidebar
        collapsible="icon"
        variant="floating"
        innerClassName={
          brandLogo
            ? cn(
                'bg-gradient-to-b from-white via-sky-50/40 to-teal-50/25',
                'group-data-[variant=floating]:rounded-xl',
                'group-data-[variant=floating]:shadow-[0_14px_44px_-22px_rgba(14,165,233,0.16)]',
                'group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sky-100/65',
              )
            : undefined
        }
        className={cn(
          'top-16 h-[calc(100svh-4rem)]',
          sidebarClassName,
        )}
      >
        <SidebarHeader
          className={cn(
            'border-b',
            brandLogo ? 'border-sky-100/60 bg-white/40' : 'border-sidebar-border',
          )}
        >
          {brandLogo ? (
            <div className="flex items-start gap-2.5 px-2 py-2">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                {brandLogoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avoid optimizer issues inside floating sidebar
                  <img
                    src={brandLogoSrc}
                    alt="Health AI"
                    width={44}
                    height={44}
                    className="h-9 w-9 object-contain p-1.5"
                    decoding="async"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{portalLabel}</p>
                {userLabel ? (
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{userLabel}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/70">
                {portalLabel}
              </p>
              {userLabel ? (
                <p className="mt-1 truncate text-sm font-semibold text-sidebar-foreground">{userLabel}</p>
              ) : null}
            </div>
          )}
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

        <SidebarFooter
          className={cn('border-t', brandLogo ? 'border-sky-100/60' : 'border-sidebar-border')}
        >
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

      <SidebarInset className={cn('min-w-0 bg-transparent md:pl-1', insetClassName)}>
        <div className="w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
