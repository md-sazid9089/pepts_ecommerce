/**
 * Phase 3 Provider Component
 * Initializes PWA, Web Vitals monitoring, and analytics
 * Should be wrapped around the app in layout.jsx
 */

'use client';

import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useWebVitals } from '@/hooks/useWebVitals';

export function Phase3Provider({ children }) {
  const pwa = usePWA();
  const webVitals = useWebVitals();

  useEffect(() => {
    // PWA & Web Vitals are now active — no-op render
  }, [pwa.isOnline, pwa.isInstallable]);

  return <>{children}</>;
}

export default Phase3Provider;


