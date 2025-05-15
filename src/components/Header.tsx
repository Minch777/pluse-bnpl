'use client';

import { useContext } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarContext } from '@/app/merchant/layout';

type HeaderProps = {
  userRole?: 'ADMIN' | 'MERCHANT';
};

export default function Header({ userRole = 'MERCHANT' }: HeaderProps) {
  const { isMobile, toggleMobileSidebar } = useContext(SidebarContext);
  const homeLink = userRole === 'ADMIN' ? '/admin/dashboard' : '/merchant/dashboard';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={toggleMobileSidebar}
            >
              <span className="sr-only">Открыть меню</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
          
          {/* Logo - centered on mobile, left on desktop */}
          <div className={isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""}>
              <Link href={homeLink}>
                <Image
                  src="/pluse-logo.png"
                  alt="Pluse"
                  width={120}
                  height={32}
                  priority
                  className="w-auto h-8"
                />
              </Link>
            </div>
          
          {/* Empty div to maintain centering on mobile */}
          {isMobile && <div className="w-6" />}
          </div>
        </div>
      </header>
  );
} 