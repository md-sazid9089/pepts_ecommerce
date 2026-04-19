// =====================================
// PRECIOUS PLAY WHOLESALE - DOLL B2B PRODUCT DATA
// Premium Doll Wholesale Platform for Retailers & Boutique Shop Owners
// =====================================

// DOLL CATEGORIES - B2B Wholesale Focus
export const categories = [
  { id: 'fashion', name: 'Fashion Dolls', icon: 'FiShoppingBag', color: '#FF69B4', bg: '#FFE5F0' },
  { id: 'porcelain', name: 'Porcelain Collectibles', icon: 'FiHome', color: '#9370DB', bg: '#E6D9F5' },
  { id: 'action', name: 'Action Figures', icon: 'FiSmartphone', color: '#7B68B8', bg: '#E6D9F5' },
  { id: 'dollhouses', name: 'Dollhouses', icon: 'FiBox', color: '#FF69B4', bg: '#FFE5F0' },
  { id: 'accessories', name: 'Accessories', icon: 'FiPalette', color: '#9370DB', bg: '#E6D9F5' },
];

export const brands = ['PreciousPlay', 'DollMasters', 'DollArt', 'CeramicArtisans', 'VictorianDolls', 'DollHeritage', 'ActionKings', 'AnimeCollect', 'FantasyForce', 'DollhomeDeluxe', 'ModernDollHomes', 'CottageCharm', 'DressDesigner', 'HomeDecor', 'AccessoryHouse'];

export const products = [
  // ═════════════════════════════════════════════════════════════════
  // FASHION DOLLS CATEGORY
  // ═════════════════════════════════════════════════════════════════

  {
    id: 1,
    category: 'fashion',
    brand: 'PreciousPlay',
    name: 'Premium Fashion Doll Collection - Assorted Series A',
    price: 850,
    originalPrice: 1200,
    discount: 29,
    rating: 4.8,
    reviews: 342,
    image: 'https://placehold.co/400?text=Fashion+Doll+Series+A',
    images: [
      'https://placehold.co/600?text=Fashion+Doll+Series+A',
      'https://placehold.co/600?text=Fashion+Doll+Back',
      'https://placehold.co/600?text=Fashion+Doll+Accessories',
    ],
    description: 'Collectible fashion dolls with premium articulation and detailed accessories. Perfect for retailers stocking trendy dolls.',
    stock: 250,
    isNew: false,
    isFeatured: true,
    isHot: true,
    inStock: true,
    moq: 10,
    casePackSize: 50,
    tieredPricing: [
      { min: 10, max: 50, price: 850, unit: 'per unit' },
      { min: 51, max: 200, price: 720, unit: 'per unit' },
      { min: 201, max: 500, price: 650, unit: 'per unit' },
      { min: 501, max: null, price: 580, unit: 'per unit' },
    ],
    specs: {
      'Height': '30cm',
      'Material': 'Premium Vinyl & Plastic',
      'Articulation': 'Full Body Poseable',
      'Package': '50 units per case',
      'Recommended For': 'Gift Shops, Toy Boutiques',
    },
  },

  {
    id: 2,
    category: 'fashion',
    brand: 'DollMasters',
    name: 'Vintage Romance Doll Series - Limited Edition',
    price: 1250,
    originalPrice: 1800,
    discount: 31,
    rating: 4.9,
    reviews: 287,
    image: 'https://placehold.co/400?text=Vintage+Romance+Doll',
    images: [
      'https://placehold.co/600?text=Vintage+Romance+Doll',
      'https://placehold.co/600?text=Vintage+Close+Up',
    ],
    description: 'Premium vintage-inspired dolls with elegant clothing and detailed accessories. High-end collectibles.',
    stock: 120,
    isNew: true,
    isFeatured: true,
    isHot: false,
    inStock: true,
    moq: 5,
    casePackSize: 25,
    tieredPricing: [
      { min: 5, max: 25, price: 1250, unit: 'per unit' },
      { min: 26, max: 100, price: 1050, unit: 'per unit' },
      { min: 101, max: 300, price: 950, unit: 'per unit' },
      { min: 301, max: null, price: 850, unit: 'per unit' },
    ],
    specs: {
      'Height': '35cm',
      'Material': 'Porcelain Face / Vinyl Body',
      'Clothing': 'Hand-sewn Couture Outfits',
      'Package': '25 units per case',
      'Tier': 'Premium / Collectible',
    },
  },

  {
    id: 3,
    category: 'fashion',
    brand: 'DollArt',
    name: 'Contemporary Style Doll - Modern Collection',
    price: 720,
    originalPrice: 950,
    discount: 24,
    rating: 4.6,
    reviews: 198,
    image: 'https://placehold.co/400?text=Contemporary+Doll',
    images: [
      'https://placehold.co/600?text=Contemporary+Doll',
    ],
    description: 'Modern-styled fashion dolls ideal for younger collectors. Bulk-friendly pricing for retailers.',
    stock: 380,
    isNew: false,
    isFeatured: false,
    isHot: true,
    inStock: true,
    moq: 15,
    casePackSize: 60,
    tieredPricing: [
      { min: 15, max: 75, price: 720, unit: 'per unit' },
      { min: 76, max: 250, price: 600, unit: 'per unit' },
      { min: 251, max: 600, price: 540, unit: 'per unit' },
      { min: 601, max: null, price: 480, unit: 'per unit' },
    ],
    specs: {
      'Height': '28cm',
      'Material': 'Vinyl & Plastic',
      'Style': 'Contemporary / Fashion Forward',
      'Package': '60 units per case',
      'Demographics': 'Age 6+, Mainstream Market',
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // PORCELAIN COLLECTIBLES CATEGORY
  // ═════════════════════════════════════════════════════════════════

  {
    id: 4,
    category: 'porcelain',
    brand: 'CeramicArtisans',
    name: 'Heirloom Porcelain Doll - Hand-Painted Series',
    price: 2800,
    originalPrice: 4200,
    discount: 33,
    rating: 4.95,
    reviews: 127,
    image: 'https://placehold.co/400?text=Porcelain+Heirloom+Doll',
    images: [
      'https://placehold.co/600?text=Porcelain+Heirloom',
      'https://placehold.co/600?text=Hand+Painted+Detail',
    ],
    description: 'Exquisite hand-painted porcelain dolls. Premium collectibles for high-end boutiques. Artist-signed series.',
    stock: 45,
    isNew: false,
    isFeatured: true,
    isHot: false,
    inStock: true,
    moq: 2,
    casePackSize: 10,
    tieredPricing: [
      { min: 2, max: 10, price: 2800, unit: 'per unit' },
      { min: 11, max: 50, price: 2400, unit: 'per unit' },
      { min: 51, max: 150, price: 2200, unit: 'per unit' },
      { min: 151, max: null, price: 2000, unit: 'per unit' },
    ],
    specs: {
      'Height': '45cm',
      'Material': 'Porcelain Face / Cloth Body',
      'Finishing': 'Hand-Painted / Artist-Signed',
      'Package': '10 units per case',
      'Target Market': 'High-End Collectibles Boutiques',
    },
  },

  {
    id: 5,
    category: 'porcelain',
    brand: 'VictorianDolls',
    name: 'Victorian Elegance Porcelain Collection',
    price: 2200,
    originalPrice: 3500,
    discount: 37,
    rating: 4.8,
    reviews: 93,
    image: 'https://placehold.co/400?text=Victorian+Porcelain',
    images: [
      'https://placehold.co/600?text=Victorian+Porcelain',
    ],
    description: 'Classic Victorian-inspired porcelain dolls with authentic period details and finest ceramics.',
    stock: 68,
    isNew: false,
    isFeatured: false,
    isHot: false,
    inStock: true,
    moq: 3,
    casePackSize: 15,
    tieredPricing: [
      { min: 3, max: 20, price: 2200, unit: 'per unit' },
      { min: 21, max: 75, price: 1900, unit: 'per unit' },
      { min: 76, max: 200, price: 1750, unit: 'per unit' },
      { min: 201, max: null, price: 1600, unit: 'per unit' },
    ],
    specs: {
      'Height': '42cm',
      'Material': 'Porcelain / Bisque',
      'Style': 'Victorian Era Authentic',
      'Package': '15 units per case',
      'Certification': 'Collectible Grade',
    },
  },

  {
    id: 6,
    category: 'porcelain',
    brand: 'DollHeritage',
    name: 'Asian Heritage Porcelain Doll - Cultural Series',
    price: 1950,
    originalPrice: 2900,
    discount: 33,
    rating: 4.7,
    reviews: 64,
    image: 'https://placehold.co/400?text=Asian+Heritage+Porcelain',
    images: [
      'https://placehold.co/600?text=Asian+Heritage',
    ],
    description: 'Authentic Asian-inspired porcelain dolls in traditional costumes. Cultural collectible series.',
    stock: 92,
    isNew: false,
    isFeatured: false,
    isHot: true,
    inStock: true,
    moq: 4,
    casePackSize: 20,
    tieredPricing: [
      { min: 4, max: 30, price: 1950, unit: 'per unit' },
      { min: 31, max: 100, price: 1650, unit: 'per unit' },
      { min: 101, max: 300, price: 1500, unit: 'per unit' },
      { min: 301, max: null, price: 1350, unit: 'per unit' },
    ],
    specs: {
      'Height': '40cm',
      'Material': 'Porcelain',
      'Dress': 'Traditional Cultural Costume',
      'Package': '20 units per case',
      'Market': 'Cultural / Specialty Collectors',
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // ACTION FIGURES CATEGORY
  // ═════════════════════════════════════════════════════════════════

  {
    id: 7,
    category: 'action',
    brand: 'ActionKings',
    name: 'Super Hero Action Figure Collection - 12-Pack',
    price: 450,
    originalPrice: 650,
    discount: 31,
    rating: 4.7,
    reviews: 412,
    image: 'https://placehold.co/400?text=Action+Figures+Heroes',
    images: [
      'https://placehold.co/600?text=Heroes+Collection',
    ],
    description: 'Premium articulated action figures with superb detail. High-demand toys for retailers.',
    stock: 450,
    isNew: false,
    isFeatured: true,
    isHot: true,
    inStock: true,
    moq: 12,
    casePackSize: 144,
    tieredPricing: [
      { min: 12, max: 100, price: 450, unit: 'per unit' },
      { min: 101, max: 300, price: 380, unit: 'per unit' },
      { min: 301, max: 800, price: 340, unit: 'per unit' },
      { min: 801, max: null, price: 300, unit: 'per unit' },
    ],
    specs: {
      'Height': '15cm',
      'Material': 'PVC / Plastic',
      'Articulation': '20+ Points',
      'Package': '144 units per case',
      'Appeal': 'Boys & Collectors',
    },
  },

  {
    id: 8,
    category: 'action',
    brand: 'AnimeCollect',
    name: 'Anime Character Action Figures - Mixed Set',
    price: 520,
    originalPrice: 750,
    discount: 31,
    rating: 4.8,
    reviews: 356,
    image: 'https://placehold.co/400?text=Anime+Action+Figures',
    images: [
      'https://placehold.co/600?text=Anime+Figures',
    ],
    description: 'Popular anime character figures with high-quality sculpts. Perfect for specialty shops.',
    stock: 310,
    isNew: true,
    isFeatured: true,
    isHot: false,
    inStock: true,
    moq: 10,
    casePackSize: 100,
    tieredPricing: [
      { min: 10, max: 80, price: 520, unit: 'per unit' },
      { min: 81, max: 250, price: 440, unit: 'per unit' },
      { min: 251, max: 600, price: 390, unit: 'per unit' },
      { min: 601, max: null, price: 350, unit: 'per unit' },
    ],
    specs: {
      'Height': '12-15cm',
      'Material': 'PVC Painted',
      'Quality': 'Collectible Grade',
      'Package': '100 units per case',
      'Market': 'Anime Fans',
    },
  },

  {
    id: 9,
    category: 'action',
    brand: 'FantasyForce',
    name: 'Fantasy Warrior Action Figures - Epic Series',
    price: 680,
    originalPrice: 1050,
    discount: 35,
    rating: 4.6,
    reviews: 234,
    image: 'https://placehold.co/400?text=Fantasy+Warriors',
    images: [
      'https://placehold.co/600?text=Fantasy+Warriors',
    ],
    description: 'Highly detailed fantasy character figures with realistic accessories. Collector-grade quality.',
    stock: 178,
    isNew: false,
    isFeatured: false,
    isHot: true,
    inStock: true,
    moq: 8,
    casePackSize: 80,
    tieredPricing: [
      { min: 8, max: 60, price: 680, unit: 'per unit' },
      { min: 61, max: 200, price: 580, unit: 'per unit' },
      { min: 201, max: 500, price: 520, unit: 'per unit' },
      { min: 501, max: null, price: 460, unit: 'per unit' },
    ],
    specs: {
      'Height': '18-20cm',
      'Material': 'High-Quality PVC',
      'Details': 'Hand-Painted / Accessories',
      'Package': '80 units per case',
      'Target': 'Fantasy Enthusiasts',
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // DOLLHOUSES CATEGORY
  // ═════════════════════════════════════════════════════════════════

  {
    id: 10,
    category: 'dollhouses',
    brand: 'DollhomeDeluxe',
    name: 'Victorian Dollhouse - Premium Luxury Model',
    price: 8500,
    originalPrice: 12800,
    discount: 34,
    rating: 4.9,
    reviews: 87,
    image: 'https://placehold.co/400?text=Victorian+Dollhouse',
    images: [
      'https://placehold.co/600?text=Victorian+House',
    ],
    description: 'Exquisite Victorian-style dollhouse with authentic architectural details. Handcrafted excellence.',
    stock: 22,
    isNew: false,
    isFeatured: true,
    isHot: false,
    inStock: true,
    moq: 1,
    casePackSize: 5,
    tieredPricing: [
      { min: 1, max: 5, price: 8500, unit: 'per unit' },
      { min: 6, max: 20, price: 7500, unit: 'per unit' },
      { min: 21, max: 50, price: 6800, unit: 'per unit' },
      { min: 51, max: null, price: 6200, unit: 'per unit' },
    ],
    specs: {
      'Dimensions': '120cm H x 100cm W x 80cm D',
      'Material': 'Premium Wood',
      'Rooms': '8+ Fully Furnished',
      'Package': '5 units per case',
      'Market': 'Luxury / High-End',
    },
  },

  {
    id: 11,
    category: 'dollhouses',
    brand: 'ModernDollHomes',
    name: 'Modern Townhouse Dollhouse - Contemporary Style',
    price: 5200,
    originalPrice: 7800,
    discount: 33,
    rating: 4.7,
    reviews: 62,
    image: 'https://placehold.co/400?text=Modern+Townhouse',
    images: [
      'https://placehold.co/600?text=Modern+Townhouse',
    ],
    description: 'Contemporary townhouse dollhouse with LED lighting. Popular with modern collectors.',
    stock: 38,
    isNew: false,
    isFeatured: false,
    isHot: true,
    inStock: true,
    moq: 2,
    casePackSize: 10,
    tieredPricing: [
      { min: 2, max: 10, price: 5200, unit: 'per unit' },
      { min: 11, max: 40, price: 4600, unit: 'per unit' },
      { min: 41, max: 100, price: 4200, unit: 'per unit' },
      { min: 101, max: null, price: 3800, unit: 'per unit' },
    ],
    specs: {
      'Dimensions': '90cm H x 80cm W x 60cm D',
      'Material': 'Wood & Modern Finishes',
      'Features': 'LED Lighting',
      'Package': '10 units per case',
      'Market': 'Contemporary Collectors',
    },
  },

  {
    id: 12,
    category: 'dollhouses',
    brand: 'CottageCharm',
    name: 'Cottage Dollhouse - Charming Country Style',
    price: 3800,
    originalPrice: 5600,
    discount: 32,
    rating: 4.6,
    reviews: 45,
    image: 'https://placehold.co/400?text=Cottage+Dollhouse',
    images: [
      'https://placehold.co/600?text=Cottage+House',
    ],
    description: 'Charming country cottage-style dollhouse. Affordable luxury for mainstream retailers.',
    stock: 54,
    isNew: false,
    isFeatured: false,
    isHot: false,
    inStock: true,
    moq: 3,
    casePackSize: 15,
    tieredPricing: [
      { min: 3, max: 15, price: 3800, unit: 'per unit' },
      { min: 16, max: 50, price: 3200, unit: 'per unit' },
      { min: 51, max: 150, price: 2900, unit: 'per unit' },
      { min: 151, max: null, price: 2600, unit: 'per unit' },
    ],
    specs: {
      'Dimensions': '75cm H x 70cm W x 50cm D',
      'Material': 'Wood & Natural',
      'Style': 'Country Cottage',
      'Package': '15 units per case',
      'Appeal': 'Families & Mainstream',
    },
  },

  // ═════════════════════════════════════════════════════════════════
  // ACCESSORIES CATEGORY
  // ═════════════════════════════════════════════════════════════════

  {
    id: 13,
    category: 'accessories',
    brand: 'DressDesigner',
    name: 'Doll Clothing & Outfit Bundle - 10-Piece Set',
    price: 280,
    originalPrice: 420,
    discount: 33,
    rating: 4.8,
    reviews: 521,
    image: 'https://placehold.co/400?text=Doll+Clothes+Bundle',
    images: [
      'https://placehold.co/600?text=Clothing+Set',
    ],
    description: 'Premium doll clothing sets with diverse styles. High-volume seller for accessory retailers.',
    stock: 890,
    isNew: false,
    isFeatured: true,
    isHot: true,
    inStock: true,
    moq: 20,
    casePackSize: 200,
    tieredPricing: [
      { min: 20, max: 150, price: 280, unit: 'per unit' },
      { min: 151, max: 500, price: 240, unit: 'per unit' },
      { min: 501, max: 1200, price: 210, unit: 'per unit' },
      { min: 1201, max: null, price: 180, unit: 'per unit' },
    ],
    specs: {
      'Contents': '10 Complete Outfits',
      'Sizes': 'Fits Standard 30cm Dolls',
      'Material': 'Premium Fabric',
      'Package': '200 units per case',
      'Category': 'High-Volume Accessory',
    },
  },

  {
    id: 14,
    category: 'accessories',
    brand: 'HomeDecor',
    name: 'Doll Furniture Collection - Bedroom & Living Room Set',
    price: 450,
    originalPrice: 700,
    discount: 36,
    rating: 4.7,
    reviews: 298,
    image: 'https://placehold.co/400?text=Doll+Furniture+Set',
    images: [
      'https://placehold.co/600?text=Furniture+Set',
    ],
    description: 'Complete furniture sets for dollhouses. Essential accessory for dollhouse retailers.',
    stock: 240,
    isNew: false,
    isFeatured: false,
    isHot: true,
    inStock: true,
    moq: 10,
    casePackSize: 50,
    tieredPricing: [
      { min: 10, max: 75, price: 450, unit: 'per unit' },
      { min: 76, max: 250, price: 380, unit: 'per unit' },
      { min: 251, max: 600, price: 340, unit: 'per unit' },
      { min: 601, max: null, price: 300, unit: 'per unit' },
    ],
    specs: {
      'Contents': 'Full Room Sets',
      'Material': 'Resin & Wood',
      'Rooms': 'Bedroom + Living Room',
      'Package': '50 units per case',
      'Market': 'Dollhouse Accessories',
    },
  },

  {
    id: 15,
    category: 'accessories',
    brand: 'AccessoryHouse',
    name: 'Doll Accessories Bundle - Shoes, Bags & Jewelry',
    price: 180,
    originalPrice: 280,
    discount: 36,
    rating: 4.9,
    reviews: 712,
    image: 'https://placehold.co/400?text=Doll+Accessories',
    images: [
      'https://placehold.co/600?text=Accessories',
    ],
    description: 'Miniature accessories to complement doll collections. Ultra-high-volume bestseller.',
    stock: 1260,
    isNew: false,
    isFeatured: true,
    isHot: true,
    inStock: true,
    moq: 30,
    casePackSize: 300,
    tieredPricing: [
      { min: 30, max: 200, price: 180, unit: 'per unit' },
      { min: 201, max: 800, price: 150, unit: 'per unit' },
      { min: 801, max: 2000, price: 130, unit: 'per unit' },
      { min: 2001, max: null, price: 110, unit: 'per unit' },
    ],
    specs: {
      'Contents': 'Mixed Accessories Bundle',
      'Pieces': '50+ Accessories',
      'Size': 'Fits Standard Dolls',
      'Package': '300 units per case',
      'Appeal': 'Ultra-Popular Volume',
    },
  },
];

// ═════════════════════════════════════════════════════════════════
// PRICE FORMATTING UTILITY
// ═════════════════════════════════════════════════════════════════
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// ═════════════════════════════════════════════════════════════════
// B2B WHOLESALE UTILITIES
// ═════════════════════════════════════════════════════════════════

// Calculate tiered price based on quantity
export const calculateTieredPrice = (product, quantity) => {
  const tier = product.tieredPricing.find(
    (t) => quantity >= t.min && (t.max === null || quantity <= t.max)
  );
  return tier ? tier.price : product.price;
};

// Calculate bulk discount percentage
export const calculateBulkDiscount = (product, quantity) => {
  const tieredPrice = calculateTieredPrice(product, quantity);
  const regularPrice = product.price;
  if (tieredPrice === regularPrice) return 0;
  return Math.round(((regularPrice - tieredPrice) / regularPrice) * 100);
};

// Get product by ID
export function getProductById(id) {
  return products.find(p => p.id === Number(id));
}

// Get products by category
export function getProductsByCategory(categoryId) {
  return products.filter(p => p.category === categoryId);
}

// Get featured products
export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

// Get hot/trending products
export function getHotProducts() {
  return products.filter(p => p.isHot);
}

// Get new products
export function getNewProducts() {
  return products.filter(p => p.isNew);
}

// Get related products by category
export function getRelatedProducts(product, limit = 4) {
  return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
}

// ═════════════════════════════════════════════════════════════════
// B2B BANNER SLIDES - Wholesale/Retail Marketing
// ═════════════════════════════════════════════════════════════════
export const bannerSlides = [
  {
    id: 1,
    title: 'Premium Fashion Dolls',
    subtitle: 'Exquisite collections for the modern boutique',
    cta: 'Shop Collection',
    href: '/products?category=fashion',
    bg: '#FFF1E8',
    accent: '#F36921',
    image: '/banner_fashion.png',
  },
  {
    id: 2,
    title: 'Porcelain Collectibles',
    subtitle: 'Victorian Elegance & Timeless Artistry',
    cta: 'Explore Heirloom',
    href: '/products?category=porcelain',
    bg: '#F8F9FA',
    accent: '#0088FF',
    image: '/banner_porcelain.png',
  },
  {
    id: 3,
    title: 'Modern Dollhouses',
    subtitle: 'Complete sets with luxury furnishings',
    cta: 'Shop Sets',
    href: '/products?category=dollhouses',
    bg: '#F5F5F5',
    accent: '#F36921',
    image: 'https://placehold.co/600x400?text=Dollhouses',
  },
];
