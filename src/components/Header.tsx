'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Banknote, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  /** Extra buttons/content rendered on the right side of the nav */
  actions?: React.ReactNode;
}

export default function Header({ actions }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

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
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
