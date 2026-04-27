/**
 * Centralized React Query key factory.
 * Using structured keys prevents typos and enables precise invalidation.
 */
export const queryKeys = {
  products: {
    all: ['products'],
    list: (params) => ['products', 'list', params],
    detail: (id) => ['products', 'detail', id],
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
  },
  inquiries: {
    all: ['inquiries'],
    list: (params) => ['inquiries', 'list', params],
  },
  admin: {
    stats: ['admin', 'stats'],
    orders: ['admin', 'orders'],
    users: ['admin', 'users'],
  },
};
