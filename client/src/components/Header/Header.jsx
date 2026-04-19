'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu,
  FiX
} from 'react-icons/fi';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
      {/* TIER 1: UTILITY BAR */}
      <div className={styles.utilityBar}>
        <div className={styles.container}>
          <div className={styles.utilityLeft}>
            <Link href="#" className={styles.utilityLink}>SELL ON PRECIOUS PLAY</Link>
            <Link href="#" className={styles.utilityLink}>CUSTOMER CARE</Link>
            <Link href="#" className={styles.utilityLink}>TRACK MY ORDER</Link>
          </div>
          <div className={styles.utilityLinks}>
            <Link href="/login" className={styles.utilityLink}>LOGIN</Link>
            <Link href="/register" className={styles.utilityLink}>SIGNUP</Link>
            <Link href="#" className={styles.utilityLink}>LANGUAGE</Link>
          </div>
        </div>
      </div>

      {/* TIER 2: MAIN HEADER */}
      <div className={styles.mainHeader}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.jpeg"
              alt="Precious Play Logo"
              width={130}
              height={45}
              priority
            />
          </Link>

          {/* Search Bar - Daraz Style (Wide & Central) */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search in Precious Play"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtnIcon}>
              <FiSearch size={18} />
            </button>
          </form>

          {/* Action Icons */}
          <div className={styles.headerActions}>
            <Link href="/profile" className={styles.actionItem}>
              <FiUser size={22} />
            </Link>
            <button className={styles.actionItem} onClick={openCart}>
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* TIER 3: NAV BAR */}
      <div className={styles.navBar}>
        <div className={styles.container}>
          <nav className={styles.navList}>
            <Link href="/products" className={styles.navLink}>
               All Products
            </Link>
            <Link href="/categories" className={styles.navLink}>
               Categories
            </Link>
            <Link href="/deals" className={styles.navLink}>
               Bulk Deals
            </Link>
            <Link href="/about" className={styles.navLink}>
               About Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className={styles.mobileMenu}>
          <Link href="/products" className={styles.mobileMenuLink}>All Products</Link>
          <Link href="/categories" className={styles.mobileMenuLink}>Categories</Link>
          <Link href="/deals" className={styles.mobileMenuLink}>Bulk Deals</Link>
          <Link href="/about" className={styles.mobileMenuLink}>About Us</Link>
        </nav>
      )}
    </header>
  );
}

