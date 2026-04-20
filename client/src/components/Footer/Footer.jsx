'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/constants/categories';
import { footerLinksWholesale, paymentMethods, socialLinksConfig } from '@/data/constants/footer';
import { fontAwesomeIcons } from '@/utils/iconMap';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiChevronDown, FiChevronUp, FiGift } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import styles from './Footer.module.css';

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionBtn} onClick={() => setOpen(!open)}>
        {title}
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {open && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Newsletter */}
      <div className={styles.newsletter}>
        <div className={`container ${styles.newsletterInner}`}>
          <div className={styles.newsletterText}>
            <h3 className={styles.newsletterTitle}><FiMail style={{marginRight: '8px'}} /> Wholesale Updates</h3>
            <p>Get new product launches, bulk pricing alerts, and exclusive wholesale offers for your boutique.</p>
          </div>
          {subscribed ? (
            <div className={styles.subscribed}>
              <FiCheckCircle style={{marginRight: '8px'}} /> You&apos;re subscribed! Get ready for amazing deals.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <div className={styles.newsletterInput}>
                <FiMail className={styles.newsletterIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  id="newsletter-email"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <FiSend size={16} /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className={styles.footerMain}>
        <div className="container">
          {/* Desktop grid */}
          <div className={styles.footerGrid}>
            {/* Brand column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.footerLogo}>
                <FiGift className={styles.logoIcon} style={{marginRight: '8px'}} /> <span>Pepta</span>
              </Link>
              <p className={styles.brandDesc}>
                Premium doll wholesale supplier for boutiques and gift shops across Bangladesh. Direct factory prices, bulk discounts, and professional wholesale service.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <FiPhone size={14} /> <span>+86 18168023963 (Global Wholesale)</span>
                </div>
                <div className={styles.contactItem}>
                  <FiMail size={14} /> <span>wholesale@precious-play-wholesale.bd</span>
                </div>
                <div className={styles.contactItem} style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <FiMapPin size={14} className="mt-1" /> 
                  <div className="flex flex-col gap-1">
                      <span>Factory & Global HQ:</span>
                    <span className="text-[10px] opacity-70">Gong Pai Wood Products, Entrance Building, Yangtian Road, Ganquan Town, Jiangyang District, Yangzhou City, Jiangsu Province.</span>
                  </div>
                </div>
              </div>
              <div className={styles.social}>
                {socialLinksConfig.map(s => {
                  const IconComponent = fontAwesomeIcons[s.iconId];
                  return (
                    <Link key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label}
                      style={{ '--social-color': s.color }}>
                      {IconComponent && <IconComponent size={18} />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Link columns — desktop */}
            {Object.entries(footerLinksWholesale).map(([title, links]) => (
              <div key={title} className={styles.linkCol}>
                <h4 className={styles.colTitle}>{title}</h4>
                <ul className={styles.linkList}>
                  {links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className={styles.footerLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Categories */}
            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Categories</h4>
              <ul className={styles.linkList}>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link href={`/products?category=${c.id}`} className={styles.footerLink}>
                      {c.icon} {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile accordion */}
          <div className={styles.mobileAccordions}>
            {Object.entries(footerLinksWholesale).map(([title, links]) => (
              <AccordionSection key={title} title={title}>
                <ul className={styles.linkList}>
                  {links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className={styles.footerLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
            ))}
          </div>

          <div className={styles.divider} />

          {/* Payment + App */}
          <div className={styles.footerBottom}>
            <div className={styles.payments}>
              <span className={styles.payLabel}>We Accept:</span>
              <div className={styles.payIcons}>
                {paymentMethods.map(m => (
                  <span key={m} className={styles.payBadge}>{m}</span>
                ))}
              </div>
            </div>
            <div className={styles.appBtns}>
              <Link href="#" className={styles.appBtn}>
                <span className={styles.appIcon}><FaGooglePlay /></span>
                <div>
                  <span className={styles.appSmall}>Get it on</span>
                  <span className={styles.appName}>Google Play</span>
                </div>
              </Link>
              <Link href="#" className={styles.appBtn}>
                <span className={styles.appIcon}><FaApple /></span>
                <div>
                  <span className={styles.appSmall}>Download on</span>
                  <span className={styles.appName}>App Store</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <div className="container">
          <p>© 2024 PreciousDolls Wholesale. All rights reserved. Premium Doll Wholesale Platform for Retailers.</p>
          <div className={styles.copyrightLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Wholesale Terms</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
