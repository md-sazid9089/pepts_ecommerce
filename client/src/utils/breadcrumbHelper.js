const home = { label: 'Home', path: '/' }

const pageLabels = {
  '/about': 'About',
  '/categories': 'Categories',
  '/products': 'All Products',
  '/search': 'Search',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/order-confirmation': 'Order Confirmation',
  '/wishlist': 'Wishlist',
  '/contact': 'Contact',
  '/login': 'Login',
  '/register': 'Sign Up',
  '/profile': 'My Account',
}

export function shouldShowBreadcrumb(pathname) {
  if (pathname === '/' || pathname.startsWith('/admin') || pathname === '/404') return false
  if (pageLabels[pathname]) return true
  return pathname.startsWith('/product/') || pathname.startsWith('/categories/')
}

export function getBreadcrumbBackground(pathname) {
  if (pathname === '/products') return '#F5EDEC'
  if (pathname === '/cart') return '#f9fafb'
  if (pathname.startsWith('/product/')) return '#f8fafc'
  return '#ffffff'
}

export function buildBreadcrumb(pathname, dynamicLabel) {
  if (!shouldShowBreadcrumb(pathname)) return []

  if (pageLabels[pathname]) {
    return [home, { label: pageLabels[pathname] }]
  }

  if (pathname.startsWith('/product/')) {
    return [
      home,
      { label: 'All Products', path: '/products' },
      { label: dynamicLabel || 'Loading...' },
    ]
  }

  if (pathname.startsWith('/categories/')) {
    const fallback = decodeURIComponent(pathname.split('/').filter(Boolean).at(-1) || 'Category')
    return [
      home,
      { label: 'Categories', path: '/categories' },
      { label: dynamicLabel || fallback },
    ]
  }

  return [home, { label: dynamicLabel || 'Page' }]
}
