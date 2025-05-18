'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

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

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      toggleSidebar, 
      isMobile, 
      sidebarVisible, 
      toggleMobileSidebar 
    }}>
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
      </div>
    </SidebarContext.Provider>
  );
} 