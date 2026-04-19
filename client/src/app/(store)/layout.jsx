import HeaderPremium from '@/components/Header/Header.premium';
import FooterPremium from '@/components/Footer/Footer.premium';
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
      <HeaderPremium />
      <main>{children}</main>
      <FooterPremium />
      <CartSidebar />
      <MobileNav />
    </>
  );
}
