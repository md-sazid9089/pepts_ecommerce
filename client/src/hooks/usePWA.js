/**
 * Hook for PWA functionality
 * - Registers Service Worker
 * - Handles install prompt
 * - Manages update checking
 * - Provides offline status
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Register Service Worker on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration);
        setSwRegistration(registration);

        // Check for updates every 60 seconds
        const updateInterval = setInterval(() => {
          registration.update().catch((err) => {
            console.warn('[PWA] Failed to check for updates:', err);
          });
        }, 60000);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New Service Worker available');
              setHasUpdate(true);
              // Notify user of update
              notifyUpdate();
            }
          });
        });

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error('[PWA] Failed to register Service Worker:', error);
      }
    };

    registerSW();
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
      console.log('[PWA] Install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[PWA] Online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('[PWA] Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Trigger install prompt
   */
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  }, [deferredPrompt]);

  /**
   * Update Service Worker
   */
  const updateSW = useCallback(() => {
    if (!swRegistration) {
      console.warn('[PWA] Service Worker not registered');
      return;
    }

    // Tell waiting SW to skip waiting
    const waitingWorker = swRegistration.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setHasUpdate(false);
    }

    // Reload page to activate new SW
    window.location.reload();
  }, [swRegistration]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(async () => {
    if (!swRegistration) {
      console.warn('[PWA] Service Worker not registered');
      return;
    }

    const sw = swRegistration.active || swRegistration.waiting;
    if (sw) {
      sw.postMessage({ type: 'CLEAR_CACHE' });
      console.log('[PWA] Cache cleared');
    }
  }, [swRegistration]);

  /**
   * Pre-cache URLs
   */
  const preCache = useCallback(
    async (urls) => {
      if (!swRegistration) {
        console.warn('[PWA] Service Worker not registered');
        return;
      }

      const sw = swRegistration.active || swRegistration.waiting;
      if (sw) {
        sw.postMessage({ type: 'CACHE_URLS', payload: { urls } });
        console.log('[PWA] Pre-caching URLs:', urls);
      }
    },
    [swRegistration]
  );

  /**
   * Request background sync
   */
  const requestSync = useCallback(
    async (tag) => {
      try {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register(tag);
          console.log('[PWA] Background sync registered:', tag);
        }
      } catch (error) {
        console.error('[PWA] Failed to register background sync:', error);
      }
    },
    []
  );

  return {
    // Status
    isInstallable,
    isOnline,
    hasUpdate,
    deferredPrompt,

    // Methods
    installApp,
    updateSW,
    clearCache,
    preCache,
    requestSync,
  };
}

/**
 * Notify user of available update
 */
function notifyUpdate() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pepta Update Available', {
      body: 'A new version is available. Refresh to update.',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'pwa-update',
      requireInteraction: false,
    });
  }
}

export default usePWA;
