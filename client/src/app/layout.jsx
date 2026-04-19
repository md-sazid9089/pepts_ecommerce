import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
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
    default: 'Precious Play Wholesale - #1 Doll B2B Marketplace',
    template: '%s | Precious Play Wholesale',
  },
  description: 'Premium doll wholesale supplier for boutiques and gift shops. Direct factory prices, tiered pricing, and verified manufacturers across Bangladesh.',
  keywords: ['wholesale dolls', 'bangladesh', 'b2b e-commerce', 'doll supplier', 'bulk toys'],
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    siteName: 'Precious Play Wholesale',
  },
};

/**
 * Root Layout - Provides global context providers
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
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
