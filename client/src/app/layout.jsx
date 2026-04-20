import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Pepta - Our Perfect Store | #1 Tech & Gadget B2B Marketplace',
    template: '%s | Pepta',
  },
  description: 'Pepta is your #1 destination for premium technology and gadget wholesale. Serving boutiques and showrooms with factory-direct prices and verified quality across Bangladesh.',
  keywords: ['pepta', 'wholesale electronics', 'bangladesh', 'b2b e-commerce', 'gadget supplier', 'bulk tech'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pepta',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    siteName: 'Pepta',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pepta',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pepta',
  url: 'https://pepta.com',
  logo: 'https://pepta.com/logo.jpeg',
  description: 'Premium technology and gadget wholesale supplier for boutiques and showrooms',
  sameAs: [
    'https://facebook.com/peptaltd',
    'https://instagram.com/peptaltd',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880-1XXX-XXXXXX',
    contactType: 'Customer Service',
    areaServed: 'BD',
    availableLanguage: 'en',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BD',
    addressLocality: 'Dhaka',
  },
};

/**
 * Root Layout - Provides global context providers
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <Script 
          id="org-schema" 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
