/**
 * Responsive layout detection and mobile screen management hook
 */

import { useState, useEffect } from 'react';

export type ScreenSize = 'mobile-small' | 'mobile-large' | 'tablet' | 'desktop';

export function useResponsiveLayout() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  // On mobile lesson view, students toggle between Lesson Instructions & Excel Grid
  const [mobileActiveView, setMobileActiveView] = useState<'content' | 'grid'>('content');

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  let screenSize: ScreenSize = 'desktop';
  if (windowWidth < 390) screenSize = 'mobile-small';
  else if (windowWidth < 768) screenSize = 'mobile-large';
  else if (windowWidth < 1024) screenSize = 'tablet';

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    mobileActiveView,
    setMobileActiveView,
  };
}
