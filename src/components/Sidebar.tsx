'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  DocumentCheckIcon, 
  PhotoIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const merchantLinks = [
  { href: '/merchant/dashboard', label: 'Показатели', icon: HomeIcon },
  { href: '/merchant/applications', label: 'Заявки', icon: DocumentTextIcon },
  { href: '/merchant/link', label: 'Ссылка', icon: LinkIcon },
  { href: '/merchant/terms', label: 'Условия', icon: DocumentCheckIcon },
  { href: '/merchant/materials', label: 'Материалы', icon: PhotoIcon },
  { href: '/merchant/settings', label: 'Настройки', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {merchantLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
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
  );
} 