'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          // Используем window.location.href для более надежного перенаправления
          window.location.href = '/login';
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
                console.log('Token expired, redirecting to login');
                localStorage.removeItem('token');
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                window.location.href = '/login';
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing JWT token:', e);
            localStorage.removeItem('token');
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/login';
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      }
    };
    
    // Добавляем небольшую задержку для выполнения проверки после полной загрузки страницы
    const timer = setTimeout(checkAuth, 500);
    
    // Слушаем событие хранилища для повторной проверки при изменении токена
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        window.location.href = '/login';
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
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