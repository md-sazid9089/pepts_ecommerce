/**
 * src/data/constants/footer.js
 * Centralized footer data to remove from component files
 * Eliminates data bloat from client-side bundles
 */

export const footerLinksWholesale = {
  'Wholesale Info': [
    { label: 'How to Buy Bulk', href: '#' },
    { label: 'Tiered Pricing Guide', href: '#' },
    { label: 'Bulk Order Process', href: '#' },
    { label: 'MOQ Information', href: '#' },
    { label: 'Wholesale FAQs', href: '#' },
    { label: 'Order Tracking', href: '#' },
  ],
  'Retailers & Boutiques': [
    { label: 'For Boutique Owners', href: '#' },
    { label: 'Gift Shop Solutions', href: '#' },
    { label: 'Franchise Opportunities', href: '#' },
    { label: 'Wholesale Terms', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Partner Program', href: '#' },
  ],
  'About Us': [
    { label: 'About PreciousDolls', href: '#' },
    { label: 'Our Suppliers', href: '#' },
    { label: 'Quality Standards', href: '#' },
    { label: 'Blog & Resources', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact Support', href: '#' },
  ],
};

export const footerLinksPremium = {
  'Shop': [
    { label: 'New Arrivals', href: '#' },
    { label: 'Best Sellers', href: '#' },
    { label: 'Collections', href: '#' },
    { label: 'Gift Cards', href: '#' },
    { label: 'Sale', href: '#' },
  ],
  'Support': [
    { label: 'Contact Us', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Shipping Info', href: '#' },
  ],
  'Company': [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Partnerships', href: '#' },
  ],
};

export const paymentMethods = [
  'Visa',
  'Mastercard',
  'bKash',
  'Nagad',
  'Rocket',
  'Cash on Delivery',
];

/**
 * Social media links - icon identifiers are stored, not icon components
 * Components import icons separately for better tree-shaking
 */
export const socialLinksConfig = [
  { iconId: 'facebook', label: 'Facebook', href: '#', color: '#1877F2' },
  { iconId: 'instagram', label: 'Instagram', href: '#', color: '#E1306C' },
  { iconId: 'twitter', label: 'Twitter', href: '#', color: '#1DA1F2' },
  { iconId: 'youtube', label: 'YouTube', href: '#', color: '#FF0000' },
  { iconId: 'tiktok', label: 'TikTok', href: '#', color: '#000000' },
];

export const socialLinksConfigPremium = [
  { iconId: 'facebook', label: 'Facebook', href: '#' },
  { iconId: 'instagram', label: 'Instagram', href: '#' },
  { iconId: 'twitter', label: 'Twitter', href: '#' },
  { iconId: 'youtube', label: 'YouTube', href: '#' },
  { iconId: 'tiktok', label: 'TikTok', href: '#' },
];
