'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon } from '@heroicons/react/24/outline';
import MobileMenu from './MobileMenu';

type HeaderProps = {
  userRole?: 'ADMIN' | 'MERCHANT';
  userName?: string;
};

export default function Header({ userRole, userName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getHomeLink = () => {
    if (userRole === 'ADMIN') return '/admin/dashboard';
    return '/merchant/dashboard';
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center md:justify-start">
            <div className="flex-1 flex items-center">
              <div className="md:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Открыть меню</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 flex justify-center md:justify-start">
                <Link href={getHomeLink()} className="flex items-center">
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
            </div>
            <div className="flex items-center">
              {userName && (
                <span className="text-sm text-gray-700">{userName}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
} 