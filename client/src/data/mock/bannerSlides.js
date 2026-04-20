/**
 * src/data/mock/bannerSlides.js
 * Banner slide data for homepage carousel
 */

export const bannerSlides = [
  {
    id: 1,
    title: 'Flagship Smartphones',
    subtitle: 'The latest mobile technology for your showroom',
    cta: 'Shop Now',
    href: '/products?category=smartphones',
    bg: '#F1F5F9',
    accent: '#1E293B',
    image: '/barbiedoll.jpg',
    backgroundImage: 'url("/barbiedoll.jpg")',
    backgroundOverlay: 'linear-gradient(135deg, rgba(241,245,249,0.3) 0%, rgba(30,41,59,0) 100%)',
  },
  {
    id: 2,
    title: 'Premium Laptops',
    subtitle: 'Performance meets portability in every design',
    cta: 'View Catalog',
    href: '/products?category=laptops',
    bg: '#FDE9EC',
    accent: '#533638',
    image: '/batman.png',
    backgroundImage: 'url("/batman.png")',
    backgroundOverlay: 'linear-gradient(135deg, rgba(253,233,236,0.3) 0%, rgba(83,54,56,0) 100%)',
  },
  {
    id: 3,
    title: 'Smart Home Hubs',
    subtitle: 'Automate your space with intelligent solutions',
    cta: 'Explore More',
    href: '/products?category=smarthome',
    bg: '#F9FAFB',
    accent: '#1E293B',
    image: '/hotwheels.jpg',
    backgroundImage: 'url("/hotwheels.jpg")',
    backgroundOverlay: 'linear-gradient(135deg, rgba(249,250,251,0.3) 0%, rgba(30,41,59,0) 100%)',
  },
];

export default bannerSlides;
