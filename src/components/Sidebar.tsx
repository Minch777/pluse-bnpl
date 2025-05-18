'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  DocumentCheckIcon, 
  PhotoIcon, 
  Cog6ToothIcon,
  UsersIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { SidebarContext } from '@/app/merchant/layout';

// Определение цветовой схемы, соответствующей остальным страницам
const colors = {
  primary: '#0891B2', // teal-600
  primaryLight: '#E0F2FE', // sky-100
  secondary: '#0EA5E9', // sky-500
  gradient: {
    from: '#0EA5E9', // sky-500
    to: '#0891B2', // teal-600
  }
};

const merchantLinks = [
  { href: '/merchant/dashboard', label: 'Заявки', icon: DocumentTextIcon },
  { href: '/merchant/link', label: 'QR и ссылка', icon: LinkIcon },
  { href: '/merchant/terms', label: 'Банки', icon: BanknotesIcon },
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
  const router = useRouter();
  const links = userRole === 'ADMIN' ? adminLinks : merchantLinks;
  const homeLink = userRole === 'ADMIN' ? '/admin/dashboard' : '/merchant/dashboard';
  const { isCollapsed, toggleSidebar, isMobile, sidebarVisible, toggleMobileSidebar } = useContext(SidebarContext);

  // Функция для проверки активного пункта меню без учета параметров URL
  const isActiveLink = (href: string) => {
    // Убираем параметры URL из текущего пути
    const currentPath = pathname?.split('?')[0];
    return currentPath === href;
  };

  // Функция для открытия страницы и модального окна преимуществ QR-кода
  const handleQRBenefitsButtonClick = () => {
    if (pathname === '/merchant/link') {
      // Если мы уже на странице, используем событие
      const event = new CustomEvent('showQRBenefits');
      window.dispatchEvent(event);
    } else {
      // Если переходим с другой страницы, используем URL параметр
      router.push('/merchant/link?show_qr_benefits=true');
    }
    
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  // Mobile sidebar - conditionally rendered
  if (isMobile) {
    if (!sidebarVisible) return null;

    return (
      <div 
        className="fixed inset-y-0 left-0 z-30 w-64 bg-[#f5f7fa] shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-[#f5f7fa]">
            <Link href={homeLink} onClick={toggleMobileSidebar} className="flex items-center">
              <div className="flex items-center space-x-2">
              <Image
                src="/pluse-logo.png"
                alt="Pluse"
                  width={100}
                  height={28}
                priority
                  className="w-auto h-6"
              />
              </div>
            </Link>
            <button 
              onClick={toggleMobileSidebar}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-4 mb-6">
              {links.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMobileSidebar}
                    className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mb-2 transition-all ${
                      isActive
                        ? 'bg-white text-gray-900 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className={`mr-3 ${isActive ? 'text-sky-600' : 'text-gray-500'}`}>
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {item.label}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-gradient-to-b from-sky-500 to-teal-600 rounded-r"></div>}
                  </Link>
                );
              })}
            </nav>
            
            {/* Multilink promo section - mobile */}
            <div className="px-4 mt-2 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-sky-50 rounded-md">
                    <LinkIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Подключите все банки в один QR</p>
                </div>
                <button 
                  onClick={handleQRBenefitsButtonClick}
                  className="mt-3 w-full h-9 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </div>
          </div>
          
          {/* Help and Support section - mobile */}
          <div className="border-t border-gray-200 pt-4 pb-6 px-4 bg-[#eef0f5]">
            <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Поддержка</p>
            <div className="mt-1">
              <Link 
                href="/merchant/help-center" 
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
                onClick={toggleMobileSidebar}
              >
                <QuestionMarkCircleIcon className="mr-3 h-4 w-4 text-gray-500" />
                Центр помощи
              </Link>
              <Link 
                href="https://wa.me/77778889900" 
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
                onClick={toggleMobileSidebar}
              >
                <ChatBubbleLeftRightIcon className="mr-3 h-4 w-4 text-gray-500" />
                Написать в WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar - used fixed positioning to ensure it doesn't take up space in the layout
  return (
    <div className={`fixed top-0 left-0 bottom-0 z-20 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="h-full border-r border-gray-200 bg-[#f5f7fa]">
        <div className="flex flex-col h-full">
          {/* Logo and Brand */}
          <div className={`flex h-16 shrink-0 items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-200 bg-[#f5f7fa]`}>
            {!isCollapsed ? (
              <Link href={homeLink} className="flex items-center">
                <Image
                  src="/pluse-logo.png"
                  alt="Pluse"
                  width={100}
                  height={28}
                  priority
                  className="w-auto h-6"
                />
              </Link>
            ) : (
              <Link href={homeLink} className="p-1.5">
                <Image
                  src="/pluse-logo-min.png"
                  alt="Pluse"
                  width={28}
                  height={28}
                  priority
                  className="w-7 h-7"
                />
              </Link>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex flex-col overflow-y-auto flex-1 pt-6 pb-4">
            <nav className="flex-1 px-3 mb-6">
              {links.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 text-sm font-medium rounded-lg mb-2 transition-all ${
                      isActive
                        ? 'bg-white text-gray-900 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className={`${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-sky-600' : 'text-gray-500'}`}>
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {!isCollapsed && item.label}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-gradient-to-b from-sky-500 to-teal-600 rounded-r"></div>}
                  </Link>
                );
              })}
            </nav>
            
            {/* Multilink promo section */}
            {!isCollapsed && (
              <div className="mx-3 mb-6">
                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-sky-50 rounded-md">
                      <LinkIcon className="h-4 w-4 text-sky-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">Подключите все банки в один QR</p>
                  </div>
                  <button 
                    onClick={handleQRBenefitsButtonClick}
                    className="mt-3 w-full h-9 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Help and Support section - desktop */}
          <div className="border-t border-gray-200 pt-4 bg-[#eef0f5]">
            <h3 className={`${isCollapsed ? 'sr-only' : 'px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'}`}>
              Поддержка
            </h3>
            <nav className="px-3">
              <Link 
                href="/merchant/help-center" 
                className={`group flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors`}
                title={isCollapsed ? 'Центр помощи' : ''}
              >
                <QuestionMarkCircleIcon 
                  className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4 text-gray-500`} 
                />
                {!isCollapsed && 'Центр помощи'}
              </Link>
              <Link 
                href="https://wa.me/77778889900" 
                className={`group flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors`}
                title={isCollapsed ? 'Написать в WhatsApp' : ''}
              >
                <ChatBubbleLeftRightIcon 
                  className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4 text-gray-500`}
                />
                {!isCollapsed && 'Написать в WhatsApp'}
              </Link>
            </nav>
          </div>

          <div className={`border-t border-gray-200 py-3 ${isCollapsed ? 'px-3' : 'px-6'} bg-[#eef0f5]`}>
            <button 
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isCollapsed ? (
                <div className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span>Свернуть меню</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 