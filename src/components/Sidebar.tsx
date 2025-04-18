'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  DocumentCheckIcon, 
  PhotoIcon, 
  Cog6ToothIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const merchantLinks = [
  { href: '/merchant/dashboard', label: 'Показатели', icon: HomeIcon },
  { href: '/merchant/applications', label: 'Заявки', icon: DocumentTextIcon },
  { href: '/merchant/link', label: 'Ссылка', icon: LinkIcon },
  { href: '/merchant/terms', label: 'Условия', icon: DocumentCheckIcon },
  { href: '/merchant/materials', label: 'Материалы', icon: PhotoIcon },
  { href: '/merchant/settings', label: 'Настройки', icon: Cog6ToothIcon },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Статистика', icon: ChartBarIcon },
  { href: '/admin/merchants', label: 'Мерчанты', icon: UsersIcon },
  { href: '/admin/applications', label: 'Заявки', icon: DocumentTextIcon },
  { href: '/admin/settings', label: 'Настройки', icon: Cog6ToothIcon },
];

type SidebarProps = {
  userRole?: 'ADMIN' | 'MERCHANT';
};

export default function Sidebar({ userRole = 'MERCHANT' }: SidebarProps) {
  const pathname = usePathname();
  const links = userRole === 'ADMIN' ? adminLinks : merchantLinks;
  const homeLink = userRole === 'ADMIN' ? '/admin/dashboard' : '/merchant/dashboard';

  return (
    <div className="hidden md:block md:w-72 min-h-screen">
      <div className="fixed h-full w-72 border-r border-gray-200 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex h-16 shrink-0 items-center px-6">
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
          <div className="flex flex-col overflow-y-auto flex-1 pt-5 pb-4">
            <nav className="flex-1 px-4">
              {links.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md mb-1 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 