'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

function LoadingBarInner() {
  const { currentTheme } = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger loading animation on pathname / searchParams change
  useEffect(() => {
    setLoading(true);
    setProgress(35);

    const step1 = setTimeout(() => {
      setProgress(75);
    }, 120);

    const step2 = setTimeout(() => {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(hideTimer);
    }, 280);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
    };
  }, [pathname, searchParams]);

  // Intercept internal link clicks for immediate responsive user feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.target !== '_blank' &&
        !target.download &&
        target.origin === window.location.origin
      ) {
        if (target.pathname !== window.location.pathname || target.search !== window.location.search) {
          setLoading(true);
          setProgress(30);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Glowing gradient bar */}
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(to right, ${currentTheme.hex}, ${currentTheme.hoverHex}, #f59e0b)`,
              boxShadow: `0 0 12px ${currentTheme.hex}`,
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarInner />
    </Suspense>
  );
}
