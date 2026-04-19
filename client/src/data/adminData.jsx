// Mock admin data for orders and customers
export const orders = [
  {
    id: 'ORD-001',
    customer: 'Ahmed Khan',
    email: 'ahmed@example.com',
    total: 12500,
    status: 'Delivered',
    items: 3,
    date: '2026-04-10',
    product: 'Samsung Galaxy S24'
  },
  {
    id: 'ORD-002',
    customer: 'Fatima Ali',
    email: 'fatima@example.com',
    total: 8999,
    status: 'Shipped',
    items: 2,
    date: '2026-04-15',
    product: 'Nike Air Force 1'
  },
  {
    id: 'ORD-003',
    customer: 'Muhammad Hassan',
    email: 'hassan@example.com',
    total: 15750,
    status: 'Processing',
    items: 5,
    date: '2026-04-16',
    product: 'Apple iPhone 15 Pro'
  },
  {
    id: 'ORD-004',
    customer: 'Sara Ibrahim',
    email: 'sara@example.com',
    total: 5999,
    status: 'Pending',
    items: 1,
    date: '2026-04-17',
    product: "L'Oreal Paris Skincare"
  },
  {
    id: 'ORD-005',
    customer: 'Ali Raza',
    email: 'ali@example.com',
    total: 22500,
    status: 'Delivered',
    items: 4,
    date: '2026-04-12',
    product: 'Sony WH-1000XM5 Headphones'
  },
  {
    id: 'ORD-006',
    customer: 'Zainab Malik',
    email: 'zainab@example.com',
    total: 18999,
    status: 'Shipped',
    items: 3,
    date: '2026-04-14',
    product: 'Adidas Ultra Boost 22'
  },
  {
    id: 'ORD-007',
    customer: 'Omar Sheikh',
    email: 'omar@example.com',
    total: 9999,
    status: 'Processing',
    items: 2,
    date: '2026-04-16',
    product: 'Zara Women Jacket'
  },
  {
    id: 'ORD-008',
    customer: 'Maha Ahmed',
    email: 'maha@example.com',
    total: 6750,
    status: 'Delivered',
    items: 2,
    date: '2026-04-11',
    product: 'IKEA Billy Bookshelf'
  },
];

export const customers = [
  { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', orders: 8, totalSpent: 45230, joinDate: '2025-01-15', status: 'Active' },
  { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', orders: 5, totalSpent: 28990, joinDate: '2025-02-20', status: 'Active' },
  { id: 3, name: 'Muhammad Hassan', email: 'hassan@example.com', orders: 12, totalSpent: 62150, joinDate: '2024-12-01', status: 'Active' },
  { id: 4, name: 'Sara Ibrahim', email: 'sara@example.com', orders: 3, totalSpent: 15770, joinDate: '2026-01-10', status: 'Active' },
  { id: 5, name: 'Ali Raza', email: 'ali@example.com', orders: 7, totalSpent: 38450, joinDate: '2025-03-05', status: 'Inactive' },
  { id: 6, name: 'Zainab Malik', email: 'zainab@example.com', orders: 6, totalSpent: 32100, joinDate: '2025-04-12', status: 'Active' },
];

// Daily sales data for chart
export const dailySalesData = [
  { date: 'Apr 1', sales: 2400, revenue: 120000, orders: 45 },
  { date: 'Apr 2', sales: 1398, revenue: 95000, orders: 38 },
  { date: 'Apr 3', sales: 9800, revenue: 180000, orders: 89 },
  { date: 'Apr 4', sales: 3908, revenue: 140000, orders: 52 },
  { date: 'Apr 5', sales: 4800, revenue: 155000, orders: 63 },
  { date: 'Apr 6', sales: 3800, revenue: 130000, orders: 48 },
  { date: 'Apr 7', sales: 4300, revenue: 160000, orders: 71 },
  { date: 'Apr 8', sales: 2300, revenue: 110000, orders: 42 },
  { date: 'Apr 9', sales: 2200, revenue: 105000, orders: 38 },
  { date: 'Apr 10', sales: 2290, revenue: 125000, orders: 51 },
  { date: 'Apr 11', sales: 2000, revenue: 98000, orders: 35 },
  { date: 'Apr 12', sales: 2181, revenue: 115000, orders: 44 },
  { date: 'Apr 13', sales: 2500, revenue: 135000, orders: 58 },
  { date: 'Apr 14', sales: 2100, revenue: 108000, orders: 41 },
  { date: 'Apr 15', sales: 2200, revenue: 112000, orders: 46 },
];

export const topProducts = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra', sold: 456, revenue: 3.9, trend: 12 },
  { id: 2, name: 'Apple iPhone 15 Pro', sold: 389, revenue: 3.1, trend: -5 },
  { id: 3, name: 'Nike Air Force 1', sold: 267, revenue: 1.8, trend: 8 },
  { id: 4, name: 'Sony WH-1000XM5', sold: 234, revenue: 2.1, trend: 15 },
  { id: 5, name: 'Adidas Ultra Boost', sold: 198, revenue: 1.6, trend: 3 },
];
