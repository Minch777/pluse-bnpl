'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  userRole?: 'MERCHANT' | 'ADMIN' | null;
  userName?: string;
};

export default function Header({ userRole, userName }: HeaderProps) {
  const pathname = usePathname();
  
  const isLoggedIn = userRole !== null;
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/pluse-logo.png"
              alt="Pluse.kz"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{userName}</span>
              <button className="btn-secondary text-sm">Выйти</button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 