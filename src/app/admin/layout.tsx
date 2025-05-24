'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';

// Create a context for the sidebar state
type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  sidebarVisible: boolean;
  toggleMobileSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobile: false,
  sidebarVisible: false,
  toggleMobileSidebar: () => {},
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Если это страница логина - не проверяем аутентификацию
  const isLoginPage = pathname === '/admin/login';
  
  // Check authentication on page load
  useEffect(() => {
    // Пропускаем проверку аутентификации для страницы логина
    if (isLoginPage) {
      setIsAuthChecked(true);
      return;
    }

    const checkAuth = () => {
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to admin login');
          // Используем window.location.href для более надежного перенаправления
          window.location.href = '/admin/login';
          return;
        }
        
        // Проверяем валидность JWT токена (если это JWT)
        if (token.includes('.')) {
          try {
            // Извлекаем payload из JWT
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // Проверяем срок действия токена если есть поле exp
            if (payload.exp) {
              const currentTime = Math.floor(Date.now() / 1000);
              if (payload.exp < currentTime) {
                console.log('Token expired, redirecting to admin login');
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing JWT token:', e);
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
            return;
          }
        }
        
        // Если дошли до сюда, то аутентификация прошла успешно
        setIsAuthChecked(true);
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/admin/login';
      }
    };
    
    // Добавляем небольшую задержку для выполнения проверки после полной загрузки страницы
    const timer = setTimeout(checkAuth, 100);
    
    // Слушаем событие хранилища для повторной проверки при изменении токена
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        window.location.href = '/admin/login';
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoginPage]);
  
  // Detect mobile screen on client-side
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // In a real application, this would be fetched from an auth provider
  const mockUser = {
    role: 'ADMIN' as const,
    name: 'Администратор',
  };

  const contextValue: SidebarContextType = {
      isCollapsed, 
      toggleSidebar, 
      isMobile, 
      sidebarVisible, 
    toggleMobileSidebar,
  };

  // Для страницы логина возвращаем просто children без сайдбара
  if (isLoginPage) {
    return children;
  }

  // Показываем экран загрузки пока проверяется аутентификация
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-sky-500 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Проверка доступа...
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="min-h-screen bg-white">
        {/* Header only visible on mobile */}
        {isMobile && <Header userRole={mockUser.role} />}
        
        {/* Both sidebar types are conditionally rendered inside the Sidebar component */}
        <Sidebar userRole={mockUser.role} />
        
        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarVisible && (
          <div 
            className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Main content */}
        <main 
          className={`relative w-full transition-all duration-300
            ${isMobile ? 'px-4 sm:px-6 py-6' : 'px-6 py-6'} 
            ${!isMobile && !isCollapsed ? 'pl-72' : ''} 
            ${!isMobile && isCollapsed ? 'pl-24' : ''}
          `}
        >
          {children}
        </main>
        <Toaster position="top-right" />
      </div>
    </SidebarContext.Provider>
  );
} 