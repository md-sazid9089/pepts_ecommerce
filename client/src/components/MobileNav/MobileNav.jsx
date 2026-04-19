'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);

  const totalCartItems = cartItems.length;
  const totalWishlistItems = wishlistItems.length;

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.mobileNav}>
      <Link href="/" className={styles.navItem} onClick={handleNavClick}>
        <FiHome size={24} />
        <span className={styles.navLabel}>Home</span>
      </Link>

      <Link href="/categories" className={styles.navItem} onClick={handleNavClick}>
        <FiGrid size={24} />
        <span className={styles.navLabel}>Categories</span>
      </Link>

      <Link href="/cart" className={`${styles.navItem} ${styles.cartItem}`} onClick={handleNavClick}>
        <div className={styles.iconWrapper}>
          <FiShoppingCart size={24} />
          {totalCartItems > 0 && (
            <span className={styles.badge}>{totalCartItems}</span>
          )}
        </div>
        <span className={styles.navLabel}>Cart</span>
      </Link>

      <Link
        href={user ? '/profile' : '/login'}
        className={styles.navItem}
        onClick={handleNavClick}
      >
        <FiUser size={24} />
        <span className={styles.navLabel}>{user ? 'Account' : 'Sign In'}</span>
      </Link>
    </nav>
  );
}
