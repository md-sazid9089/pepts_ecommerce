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
    default: 'Dazzle - #1 Tech & Gadget B2B Marketplace',
    template: '%s | Dazzle',
  },
  description: 'Premium technology and gadget wholesale supplier for boutiques and showrooms. Direct factory prices, tiered pricing, and verified manufacturers across Bangladesh.',
  keywords: ['wholesale electronics', 'bangladesh', 'b2b e-commerce', 'gadget supplier', 'bulk tech'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dazzle',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    siteName: 'Dazzle',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@dazzle',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dazzle',
  url: 'https://dazzle.com',
  logo: 'https://dazzle.com/logo.png',
  description: 'Premium technology and gadget wholesale supplier for boutiques and showrooms',
  sameAs: [
    'https://facebook.com/dazzlewholesale',
    'https://instagram.com/dazzlewholesale',
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
