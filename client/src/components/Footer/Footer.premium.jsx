'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { footerLinksPremium, socialLinksConfigPremium } from '@/data/constants/footer';
import { fontAwesomeIcons } from '@/utils/iconMap';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import styles from './Footer.premium.module.css';

export default function FooterPremium() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterContent}>
              <h3 className={styles.newsletterTitle}>
                Get Exclusive Offers
              </h3>
              <p className={styles.newsletterSubtitle}>
                Subscribe to our newsletter and receive curated collections,
                early access to new releases, and special member-only discounts.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  <FiSend size={18} />
                </button>
              </div>
              {subscribed && (
                <p className={styles.successMessage}>
                  <FiCheckCircle size={16} /> Thanks for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          {/* Footer Grid */}
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandColumn}>
              <Link href="/" className={styles.logo}>
                <Image
                  src="/logo.jpeg"
                  alt="Pepta"
                  width={140}
                  height={50}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Link>
              <p className={styles.tagline}>
                Premium collections for the most discerning collectors and gift-givers.
              </p>

              {/* Social Links */}
              <div className={styles.socialLinks}>
                {socialLinksConfigPremium.map((social) => {
                  const IconComponent = fontAwesomeIcons[social.iconId];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className={styles.socialLink}
                      aria-label={social.label}
                      title={social.label}
                    >
                      {IconComponent && <IconComponent size={18} />}
                    </a>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <FiPhone size={16} />
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </div>
                <div className={styles.contactItem}>
                  <FiPhone size={16} />
                  <a href="tel:+8618168023963">+86 18168023963</a>
                </div>
                <div className={styles.contactItem}>
                  <FiMail size={16} />
                  <a href="mailto:hello@precious.com">hello@precious.com</a>
                </div>
                <div className={styles.contactItem}>
                  <FiMapPin size={16} className="shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span>123 Premium St, Luxury City</span>
                    <span className="text-[10px] opacity-60 leading-tight mt-1">Gong Pai Wood Products, Entrance Building, Yangtian Road, Ganquan Town, Jiangyang District, Yangzhou City, Jiangsu Province.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinksPremium).map(([section, links]) => (
              <div key={section} className={styles.linkColumn}>
                <h4 className={styles.columnTitle}>{section}</h4>
                <nav className={styles.linkList}>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={styles.link}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            {/* Mobile Apps */}
            <div className={styles.appsColumn}>
              <h4 className={styles.columnTitle}>Download App</h4>
              <div className={styles.appButtons}>
                <a href="#" className={styles.appButton}>
                  <FaApple size={20} />
                  <div>
                    <div className={styles.appLabel}>Download on</div>
                    <div className={styles.appName}>App Store</div>
                  </div>
                </a>
                <a href="#" className={styles.appButton}>
                  <FaGooglePlay size={20} />
                  <div>
                    <div className={styles.appLabel}>Get it on</div>
                    <div className={styles.appName}>Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Bottom Footer */}
          <div className={styles.bottomFooter}>
            <p className={styles.copyright}>
              &copy; 2024 Pepta. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
