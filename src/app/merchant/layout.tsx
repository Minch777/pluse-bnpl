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

export default function MerchantLayout({
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
        console.log('MerchantLayout: Checking authentication... timestamp:', new Date().toISOString());
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        
        console.log('MerchantLayout: Token check result:', {
          hasToken: !!token,
          tokenPreview: token ? `${token.slice(0, 30)}...` : 'No token found',
          tokenLength: token ? token.length : 0,
          currentPath: window.location.pathname
        });
        
        if (!token) {
          console.log('MerchantLayout: No token found, redirecting to login');
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          // Используем window.location.href для более надежного перенаправления
          window.location.href = '/login';
          return;
        }
        
        console.log('MerchantLayout: Token found, user is authenticated');
        
        // Проверяем валидность JWT токена (если это JWT)
        if (token.includes('.')) {
          try {
            // Извлекаем payload из JWT
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            console.log('MerchantLayout: JWT payload:', payload);
            
            // Проверяем срок действия токена если есть поле exp
            if (payload.exp) {
              const currentTime = Math.floor(Date.now() / 1000);
              if (payload.exp < currentTime) {
                console.log('MerchantLayout: Token expired, redirecting to login');
                localStorage.removeItem('token');
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                window.location.href = '/login';
                return;
              }
            }
            
            console.log('MerchantLayout: JWT token is valid');
          } catch (e) {
            console.error('MerchantLayout: Error parsing JWT token:', e);
            console.log('MerchantLayout: Token content:', token);
            localStorage.removeItem('token');
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/login';
            return;
          }
        } else {
          console.log('MerchantLayout: Token is not JWT format, treating as valid');
        }
        
        console.log('MerchantLayout: Authentication check passed successfully');
      } catch (error) {
        console.error('MerchantLayout: Auth check error:', error);
        window.location.href = '/login';
      }
    };
    
    // Убираем задержку - проверяем сразу
    checkAuth();
    
    // Слушаем событие хранилища для повторной проверки при изменении токена
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        window.location.href = '/login';
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
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
    role: 'MERCHANT' as const,
    name: 'Алексей',
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