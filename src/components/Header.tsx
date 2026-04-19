'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Banknote, LogOut, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  /** Extra buttons/content rendered on the right side of the nav */
  actions?: React.ReactNode;
}

export default function Header({ actions }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Banknote className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Bank Churn Tracker
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {actions && <div className="mr-2">{actions}</div>}

          <Link
            href="/offers"
            className={cn(
              'text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors',
              pathname === '/offers' || pathname.startsWith('/offers/')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            )}
          >
            Bank Bonuses
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  'text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors',
                  pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                )}
              >
                Dashboard
              </Link>

              {/* User menu */}
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 text-slate-400 transition-transform duration-200',
                      menuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
