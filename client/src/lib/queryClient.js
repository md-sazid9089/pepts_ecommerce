import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── Slow-network optimizations (2G / 3G) ──────────────────────────────
      // 5-minute stale window: cached data is served without a network
      // round-trip for the duration, massively cutting bandwidth usage.
      staleTime: 5 * 60 * 1000,          // 5 minutes — use cache first
      gcTime:    30 * 60 * 1000,         // 30 minutes — keep in memory longer

      // Serve stale cache immediately; background revalidate only when online.
      networkMode: 'offlineFirst',

      // Don't burn mobile data when the user alt-tabs and comes back.
      refetchOnWindowFocus: false,
      refetchOnMount: true,              // still refresh on first mount
      refetchOnReconnect: true,          // refetch when back online

      // Exponential back-off (1 s → 2 s → 4 s … max 10 s) — friendlier on
      // flaky connections than hammering the server immediately.
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 10_000),
    },
  },
});
