'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { HeartPulse, LogOut, PanelLeft, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardRoute = Boolean(
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/doctor') ||
    pathname?.startsWith('/patient'),
  );
  const isDoctorPortal = Boolean(pathname?.startsWith('/doctor'));
  const isPatientPortal = Boolean(pathname?.startsWith('/patient'));

  if (
    pathname?.startsWith('/auth/sign-in') ||
    pathname?.startsWith('/auth/register') ||
    pathname?.startsWith('/forgot-password')
  ) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/sign-in');
  };

  const handleToggleDrawer = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
        metaKey: true,
      }),
    );
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/admin';
      case 'DOCTOR':
        return '/doctor';
      default:
        return '/patient';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const showHealthBranding = isDoctorPortal || isPatientPortal;
  const homeHref = isDoctorPortal ? '/doctor' : isPatientPortal ? '/patient' : '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60',
        showHealthBranding
          ? 'border-sky-100/80 bg-white/90 supports-[backdrop-filter]:bg-white/80'
          : 'border-border bg-background/95',
      )}
    >
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {showHealthBranding ? (
          <Link href={homeHref} className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- stable URL from /public */}
              <img
                src="/logo-healthai.png"
                alt="Health AI"
                width={36}
                height={36}
                className="h-8 w-8 object-contain p-1"
                decoding="async"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Health<span className="text-teal-600">AI</span>
            </span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Health<span className="text-primary">AI</span>
            </span>
          </Link>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isDashboardRoute && (
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="md:hidden"
                  onClick={handleToggleDrawer}
                  aria-label="Open sidebar"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
                  <div className="hidden flex-col items-end md:flex">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`${getDashboardPath()}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/auth/sign-in')}>
                Login
              </Button>
              <Button onClick={() => router.push('/auth/register')}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
