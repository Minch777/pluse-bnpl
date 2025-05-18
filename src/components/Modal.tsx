'use client';

import { ReactNode, useEffect, useState, useRef, useLayoutEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export default function Modal({ isOpen, onClose, children, maxWidth = 'lg' }: ModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollbarWidthRef = useRef<number>(0);
  const pageScrollYRef = useRef<number>(0);
  const originalBodyStylesRef = useRef<{
    position: string;
    top: string;
    left: string;
    width: string;
    overflow: string;
    paddingRight: string;
  }>({
    position: '',
    top: '',
    left: '',
    width: '',
    overflow: '',
    paddingRight: '',
  });

  // Calculate scrollbar width on mount
  useLayoutEffect(() => {
    // Calculate the width of the scrollbar
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    scrollbarWidthRef.current = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }, []);

  // Force faster synchronous layout update
  useLayoutEffect(() => {
    if (isOpen && !isRendered) {
      setIsRendered(true);
    }
  }, [isOpen, isRendered]);

  // Apply styles directly to DOM for smoother transitions
  useEffect(() => {
    if (!isRendered) return;

    const backdrop = backdropRef.current;
    const content = contentRef.current;
    const root = rootRef.current;
    const mainElement = document.querySelector('main');
    const sidebarElement = document.querySelector('div[class*="fixed top-0 left-0 bottom-0"]');

    if (!backdrop || !content || !root) return;

    // Save body's original styles
    const saveOriginalStyles = () => {
      originalBodyStylesRef.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };
    };

    // Restore body's original styles
    const restoreOriginalStyles = () => {
      document.body.style.position = originalBodyStylesRef.current.position;
      document.body.style.top = originalBodyStylesRef.current.top;
      document.body.style.left = originalBodyStylesRef.current.left;
      document.body.style.width = originalBodyStylesRef.current.width;
      document.body.style.overflow = originalBodyStylesRef.current.overflow;
      document.body.style.paddingRight = originalBodyStylesRef.current.paddingRight;
      
      // Restore scroll position
      window.scrollTo(0, pageScrollYRef.current);
    };

    // Force a browser reflow before applying animations
    backdrop.getBoundingClientRect();
    
    if (isOpen) {
      // Store current scroll position
      pageScrollYRef.current = window.scrollY;
      
      // Save original styles before modifying
      saveOriginalStyles();
      
      // Apply styles immediately in one batch
      root.style.visibility = 'visible';
      backdrop.style.opacity = '1';
      backdrop.style.backdropFilter = 'blur(4px)';
      backdrop.style.WebkitBackdropFilter = 'blur(4px)';
      content.style.opacity = '1';
      content.style.transform = 'scale(1) translateY(0)';

      // Lower z-index of sidebar to ensure it's below the backdrop
      if (sidebarElement) {
        sidebarElement.style.zIndex = '10'; // Lower than backdrop's z-index
      }

      // Lock body scroll with padding compensation
      const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
      if (hasScrollbar) {
        document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;
        if (mainElement) {
          mainElement.style.paddingRight = `${scrollbarWidthRef.current}px`;
        }
      }
      
      // Lock body
      document.body.style.overflow = 'hidden';
      
      return () => {
        restoreOriginalStyles();
        
        // Restore z-index of sidebar
        if (sidebarElement) {
          sidebarElement.style.zIndex = '';
        }
        
        if (mainElement) {
          mainElement.style.paddingRight = '';
        }
      };
    } else {
      // Animate out
      backdrop.style.opacity = '0';
      backdrop.style.backdropFilter = 'blur(0px)';
      backdrop.style.WebkitBackdropFilter = 'blur(0px)';
      content.style.opacity = '0';
      content.style.transform = 'scale(0.95) translateY(4px)';
      
      // Reset body styles after animation
      const timer = setTimeout(() => {
        if (root) root.style.visibility = 'hidden';
        
        restoreOriginalStyles();
        
        // Restore z-index of sidebar
        if (sidebarElement) {
          sidebarElement.style.zIndex = '';
        }
        
        if (mainElement) {
          mainElement.style.paddingRight = '';
        }
        
        // Only remove from DOM if modal is actually closed
        if (!isOpen) {
          setIsRendered(false);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Always render the container but control visibility
  if (!isRendered) return null;

  return (
    <div 
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      {/* Backdrop with blur - now covers the entire window including sidebar */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 will-change-opacity will-change-backdrop-filter z-[999]"
        style={{ 
          opacity: 0,
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          transition: 'opacity 200ms ease-out, backdrop-filter 200ms ease-out',
        }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        ref={contentRef}
        className={`relative ${maxWidthClasses[maxWidth]} w-full bg-white rounded-xl shadow-xl m-4 will-change-transform will-change-opacity z-[9999]`}
        style={{ 
          opacity: 0,
          transform: 'scale(0.95) translateY(4px)',
          transition: 'opacity 200ms ease-out, transform 200ms ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
} 