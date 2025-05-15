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

export default function AdminLayout({
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
    role: 'ADMIN' as const,
    name: 'Администратор',
  };

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      toggleSidebar, 
      isMobile, 
      sidebarVisible, 
      toggleMobileSidebar 
    }}>
    <div className="min-h-screen bg-slate-50">
        {/* Header only visible on mobile */}
        {isMobile && <Header userRole={mockUser.role} userName={mockUser.name} />}
        
        {/* Both sidebar types are conditionally rendered inside the Sidebar component */}
        <Sidebar userRole={mockUser.role} />
        
        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarVisible && (
          <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Main content with padding instead of margin */}
        <main 
          className={`w-full transition-all duration-300
            ${isMobile ? 'px-4 sm:px-6 py-6' : 'py-8'} 
            ${!isMobile && !isCollapsed ? 'pl-72 pr-8' : ''} 
            ${!isMobile && isCollapsed ? 'pl-24 pr-8' : ''}
          `}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
} 