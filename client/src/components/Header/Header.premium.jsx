'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHelpCircle,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage
} from 'react-icons/fi';
import styles from './Header.premium.module.css';

export default function HeaderPremium() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* LEFT: Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.jpeg"
            alt="Precious Play"
            width={140}
            height={50}
            priority
          />
        </Link>

        {/* CENTER: Search Bar - Primary Action */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search products, collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        {/* RIGHT: Navigation & Actions */}
        <div className={styles.rightSection}>
          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/products" className={styles.navLink}>
              Collections
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Support
            </Link>
          </nav>

          {/* Action Icons */}
          <div className={styles.actions}>
            {/* Cart */}
            <button
              onClick={openCart}
              className={styles.iconButton}
              aria-label="Shopping Cart"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </button>

            {/* User Menu */}
            <div className={styles.userMenu}>
              <button
                className={styles.iconButton}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Account"
              >
                <FiUser size={20} />
              </button>
              
              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  {user ? (
                    <>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                      <hr className={styles.divider} />
                      <Link href="/profile" className={styles.dropdownLink}>
                        <FiUser size={16} /> My Profile
                      </Link>
                      <Link href="/orders" className={styles.dropdownLink}>
                        <FiPackage size={16} /> My Orders
                      </Link>
                      <hr className={styles.divider} />
                      <button
                        onClick={handleLogout}
                        className={styles.dropdownLink}
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className={styles.dropdownLink}>
                        Login
                      </Link>
                      <Link href="/register" className={styles.dropdownLink}>
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink}>
            Home
          </Link>
          <Link href="/products" className={styles.mobileNavLink}>
            Collections
          </Link>
          <Link href="/contact" className={styles.mobileNavLink}>
            Support
          </Link>
        </div>
      )}
    </header>
  );
}
