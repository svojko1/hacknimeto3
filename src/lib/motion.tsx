// This is a mock implementation of framer-motion using basic CSS transitions
// In a real project, you would install and use framer-motion

import React from 'react';
import { cn } from '@/lib/utils';

type MotionProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  transition?: Record<string, any>;
};

export const motion = {
  div: ({ 
    className, 
    children, 
    initial, 
    animate, 
    exit, 
    whileHover, 
    whileTap, 
    transition,
    ...props 
  }: MotionProps) => {
    // Simplified implementation - would actually use CSS transitions/animations
    const style: React.CSSProperties = {
      transition: transition?.duration ? `all ${transition.duration}s ease` : 'all 0.3s ease',
    };
    
    if (animate?.opacity !== undefined) {
      style.opacity = animate.opacity;
    }
    
    if (animate?.x !== undefined) {
      style.transform = `translateX(${animate.x}px)`;
    }
    
    // Apply initial opacity if defined
    if (initial?.opacity !== undefined) {
      style.opacity = initial.opacity;
    }
    
    const hoverClass = whileHover ? 'hover:scale-105' : '';
    
    return (
      <div className={cn(className, hoverClass)} style={style} {...props}>
        {children}
      </div>
    );
  }
};

export const AnimatePresence = ({ 
  children,
  mode
}: { 
  children: React.ReactNode,
  mode?: string 
}) => {
  // This is a simplified mock of AnimatePresence
  return <>{children}</>;
};