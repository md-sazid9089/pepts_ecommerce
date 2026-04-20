/**
 * src/data/constants/categories.js
 * Product category definitions for the B2B marketplace
 */

export const categories = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: 'FiSmartphone',
    image: '/catagoryactionfigure.png', // Reusing existing paths but with tech names
    color: '#1E293B',
    bg: '#F1F5F9',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'FiMonitor',
    image: '/toycatagory.png',
    color: '#533638',
    bg: '#F5EDEC',
  },
  {
    id: 'wearables',
    name: 'Smart Wearables',
    icon: 'FiWatch',
    image: '/dollcatagory.png',
    color: '#F08FA8',
    bg: '#FDE9EC',
  },
  {
    id: 'smarthome',
    name: 'Smart Home',
    icon: 'FiZap',
    image: '/rccatagory.png',
    color: '#FF6B35',
    bg: '#FFE5D9',
  },
];

export default categories;
