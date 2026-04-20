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
    default: 'Pepta - #1 Doll B2B Marketplace',
    template: '%s | Pepta',
  },
  description: 'Premium doll wholesale supplier for boutiques and gift shops. Direct factory prices, tiered pricing, and verified manufacturers across Bangladesh.',
  keywords: ['wholesale dolls', 'bangladesh', 'b2b e-commerce', 'doll supplier', 'bulk toys'],
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

// JSON-LD Schema for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pepta',
  url: 'https://precious-play-wholesale.com',
  logo: 'https://precious-play-wholesale.com/logo.png',
  description: 'Premium doll wholesale supplier for boutiques and gift shops',
  sameAs: [
    'https://facebook.com/preciousplaywholesale',
    'https://instagram.com/preciousplaywholesale',
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
