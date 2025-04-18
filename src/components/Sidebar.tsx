'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  userRole: 'MERCHANT' | 'ADMIN';
};

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  
  const merchantLinks = [
    { href: '/merchant/dashboard', label: 'Главная' },
    { href: '/merchant/applications', label: 'Заявки' },
    { href: '/merchant/link', label: 'Ссылка' },
    { href: '/merchant/terms', label: 'Условия' },
    { href: '/merchant/materials', label: 'Материалы' },
    { href: '/merchant/settings', label: 'Настройки' },
  ];
  
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Дашборд' },
    { href: '/admin/merchants', label: 'Предприниматели' },
    { href: '/admin/applications', label: 'Заявки' },
    { href: '/admin/terms', label: 'Условия' },
  ];
  
  const links = userRole === 'MERCHANT' ? merchantLinks : adminLinks;
  
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 rounded-md transition-colors ${
                pathname === link.href || pathname.startsWith(`${link.href}/`) ? 
                'bg-blue-50 text-blue-600' : 
                'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {userRole === 'MERCHANT' && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-md bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-800">Нужна помощь?</h3>
              <p className="mt-2 text-xs text-blue-700">
                Если у вас возникли вопросы, обратитесь в нашу службу поддержки.
              </p>
              <a 
                href="https://wa.me/77778244804" 
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              >
                Связаться с поддержкой
              </a>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
} 