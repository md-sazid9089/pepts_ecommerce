import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ErrorBoundary from './components/ErrorBoundary'

// Layout — always needed, load eagerly
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop'

// ── Lazy-loaded page chunks ─────────────────────────────────────────────────
// Each page becomes its own split chunk → smaller initial bundle
const HomePage          = lazy(() => import('./pages/HomePage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))
const CategoriesPage    = lazy(() => import('./pages/CategoriesPage'))
const ProductsPage      = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const SearchPage        = lazy(() => import('./pages/SearchPage'))
const CartPage          = lazy(() => import('./pages/CartPage'))
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage      = lazy(() => import('./pages/WishlistPage'))
const ContactPage       = lazy(() => import('./pages/ContactPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/RegisterPage'))
const ProfilePage       = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminLoginPage    = lazy(() => import('./pages/admin/AdminLoginPage'))

// ── Page loading fallback ───────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '0.75rem',
      color: '#533638',
      fontSize: '1rem',
      fontWeight: 500,
    }}>
      <span style={{
        display: 'inline-block',
        width: 24,
        height: 24,
        border: '3px solid #F7B9C4',
        borderTopColor: '#533638',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function AppInner() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ErrorBoundary>
            <div className="bg-white text-slate-900 flex flex-col min-h-screen">
              {!isAdminRoute && <Header />}
              <ScrollToTop />

              <main className="grow flex flex-col">
                <Suspense fallback={<PageLoader />}>
                  {/*
                    key={location.key} forces a full remount of the matched route
                    component on every navigation, preventing stale cached UI
                    on back/forward button presses.
                  */}
                  <Routes location={location} key={location.key}>
                    {/* Store Routes */}
                    <Route path="/"                element={<HomePage />} />
                    <Route path="/about"           element={<AboutPage />} />
                    <Route path="/categories"      element={<CategoriesPage />} />
                    <Route path="/products"        element={<ProductsPage />} />
                    <Route path="/product/:id"     element={<ProductDetailPage />} />
                    <Route path="/search"          element={<SearchPage />} />
                    <Route path="/cart"            element={<CartPage />} />
                    <Route path="/checkout"        element={<CheckoutPage />} />
                    <Route path="/wishlist"        element={<WishlistPage />} />
                    <Route path="/contact"         element={<ContactPage />} />

                    {/* Auth Routes */}
                    <Route path="/login"           element={<LoginPage />} />
                    <Route path="/register"        element={<RegisterPage />} />

                    {/* User Routes */}
                    <Route path="/profile"         element={<ProfilePage />} />

                    {/* Admin Routes */}
                     <Route path="/admin/login"     element={<AdminLoginPage />} />
                     <Route path="/admin/dashboard" element={<AdminDashboard />} />

                    {/* 404 — must be last */}
                    <Route path="*"               element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>

              {!isAdminRoute && <Footer />}
            </div>
          </ErrorBoundary>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  )
}

export default App
