import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,        // data is fresh for 30 seconds
      gcTime: 1000 * 60 * 5,       // keep in memory for 5 minutes
      refetchOnWindowFocus: true,   // refetch when user returns to tab
      refetchOnMount: true,         // refetch when component remounts (back navigation)
      refetchOnReconnect: true,     // refetch after network reconnects
      retry: 2,                     // retry failed requests twice
    },
  },
});
