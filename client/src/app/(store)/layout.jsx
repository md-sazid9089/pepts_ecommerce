import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CartSidebar from '@/components/CartSidebar/CartSidebar';
import MobileNav from '@/components/MobileNav/MobileNav';

/**
 * Store Layout - Wraps all customer-facing routes
 * Routes should be moved into this (store) group folder
 * Provides: Header, Footer, CartSidebar, MobileNav
 */
export default function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSidebar />
      <MobileNav />
    </>
  );
}
