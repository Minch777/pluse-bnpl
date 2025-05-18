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

    if (!backdrop || !content || !root) return;

    // Force a browser reflow before applying animations
    backdrop.getBoundingClientRect();
    
    if (isOpen) {
      // Apply styles immediately in one batch
      root.style.visibility = 'visible';
      backdrop.style.opacity = '1';
      backdrop.style.backdropFilter = 'blur(4px)';
      backdrop.style.WebkitBackdropFilter = 'blur(4px)';
      content.style.opacity = '1';
      content.style.transform = 'scale(1) translateY(0)';
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
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
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.paddingRight = '';
        
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
      {/* Backdrop with blur */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 will-change-opacity will-change-backdrop-filter"
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
        className={`relative ${maxWidthClasses[maxWidth]} w-full bg-white rounded-xl shadow-xl m-4 will-change-transform will-change-opacity`}
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