/**
 * Prisma Seed Script
 * Populates the Hostinger MySQL database with categories, products,
 * and bulk pricing tiers from the mock data.
 *
 * Run with: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: 'Fashion Dolls',       description: 'Premium fashion and collectible dolls',        icon: '🪆' },
  { name: 'Porcelain',           description: 'Handcrafted porcelain collectible dolls',       icon: '🏺' },
  { name: 'Action Figures',      description: 'Articulated action and anime figures',          icon: '🦸' },
  { name: 'Dollhouses',          description: 'Luxury and modern dollhouse collections',       icon: '🏠' },
  { name: 'Accessories',         description: 'Clothing, furniture, and doll accessories',    icon: '👗' },
];

// ─── Products ─────────────────────────────────────────────────────────────────
// Each product has a categoryName (must match one above), core fields, and tieredPricing.
const products = [
  // ── Fashion Dolls ──────────────────────────────────────────────────────────
  {
    categoryName: 'Fashion Dolls',
    title: 'Premium Fashion Doll Collection - Assorted Series',
    description: 'Premium handcrafted plush toy featuring soft texture and institutional-grade durability. Perfect for retail collections, specialty gift shops, and premium toy boutiques.',
    price: 850,
    stock: 250,
    imageUrl: 'https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 10,  price: 850,  discount: null },
      { minQuantity: 51,  price: 720,  discount: 15.3 },
      { minQuantity: 201, price: 650,  discount: 23.5 },
      { minQuantity: 501, price: 580,  discount: 31.8 },
    ],
  },
  {
    categoryName: 'Fashion Dolls',
    title: 'Cat Toy Cartoon Customized Plush Doll - OEM Series',
    description: 'Cat Toy Cartoon Customized Hot Selling Plush Toy New Baby OEM Creative cute Gift Stuffed Toy. Toys logo Figure. Ideal for specialty gift shops.',
    price: 1250,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1559715541-51832d29d9fa?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 5,   price: 1250, discount: null },
      { minQuantity: 26,  price: 1050, discount: 16 },
      { minQuantity: 101, price: 950,  discount: 24 },
      { minQuantity: 301, price: 850,  discount: 32 },
    ],
  },
  {
    categoryName: 'Fashion Dolls',
    title: 'Contemporary Style Doll - Modern Collection',
    description: 'Modern-styled fashion dolls ideal for younger collectors. Bulk-friendly pricing for retailers.',
    price: 720,
    stock: 380,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 15,  price: 720, discount: null },
      { minQuantity: 76,  price: 600, discount: 16.7 },
      { minQuantity: 251, price: 540, discount: 25 },
      { minQuantity: 601, price: 480, discount: 33.3 },
    ],
  },

  // ── Porcelain ──────────────────────────────────────────────────────────────
  {
    categoryName: 'Porcelain',
    title: 'OEM Cute Fluffy Animal Plush Doll - Cake Pendant Series',
    description: 'New Design OEM Cute Fluffy Animal dolls cake stuffed food Pendant Funny Plush Toy. High-end collectible series for specialty boutiques.',
    price: 2800,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 2,   price: 2800, discount: null },
      { minQuantity: 11,  price: 2400, discount: 14.3 },
      { minQuantity: 51,  price: 2200, discount: 21.4 },
      { minQuantity: 151, price: 2000, discount: 28.6 },
    ],
  },
  {
    categoryName: 'Porcelain',
    title: 'Victorian Elegance Porcelain Collection',
    description: 'Classic Victorian-inspired porcelain dolls with authentic period details and finest ceramics.',
    price: 2200,
    stock: 68,
    imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 3,   price: 2200, discount: null },
      { minQuantity: 21,  price: 1900, discount: 13.6 },
      { minQuantity: 76,  price: 1750, discount: 20.5 },
      { minQuantity: 201, price: 1600, discount: 27.3 },
    ],
  },
  {
    categoryName: 'Porcelain',
    title: 'Asian Heritage Porcelain Doll - Cultural Series',
    description: 'Authentic Asian-inspired porcelain dolls in traditional costumes. Cultural collectible series for specialty retailers.',
    price: 1950,
    stock: 92,
    imageUrl: 'https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 4,   price: 1950, discount: null },
      { minQuantity: 31,  price: 1650, discount: 15.4 },
      { minQuantity: 101, price: 1500, discount: 23.1 },
      { minQuantity: 301, price: 1350, discount: 30.8 },
    ],
  },

  // ── Action Figures ─────────────────────────────────────────────────────────
  {
    categoryName: 'Action Figures',
    title: 'Super Hero Action Figure Collection - 12-Pack',
    description: 'Premium articulated action figures with superb detail. High-demand toys for retailers and collectors.',
    price: 450,
    stock: 450,
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 12,  price: 450, discount: null },
      { minQuantity: 101, price: 380, discount: 15.6 },
      { minQuantity: 301, price: 340, discount: 24.4 },
      { minQuantity: 801, price: 300, discount: 33.3 },
    ],
  },
  {
    categoryName: 'Action Figures',
    title: 'Anime Character Action Figures - Mixed Set',
    description: 'Popular anime character figures with high-quality sculpts. Perfect for specialty shops and collector markets.',
    price: 520,
    stock: 310,
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 10,  price: 520, discount: null },
      { minQuantity: 81,  price: 440, discount: 15.4 },
      { minQuantity: 251, price: 390, discount: 25 },
      { minQuantity: 601, price: 350, discount: 32.7 },
    ],
  },
  {
    categoryName: 'Action Figures',
    title: 'Fantasy Warrior Action Figures - Epic Series',
    description: 'Highly detailed fantasy character figures with realistic accessories. Collector-grade quality for enthusiasts.',
    price: 680,
    stock: 178,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 8,   price: 680, discount: null },
      { minQuantity: 61,  price: 580, discount: 14.7 },
      { minQuantity: 201, price: 520, discount: 23.5 },
      { minQuantity: 501, price: 460, discount: 32.4 },
    ],
  },

  // ── Dollhouses ─────────────────────────────────────────────────────────────
  {
    categoryName: 'Dollhouses',
    title: 'Victorian Dollhouse - Premium Luxury Model',
    description: 'Exquisite Victorian-style dollhouse with authentic architectural details. Handcrafted excellence for luxury retail.',
    price: 8500,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 1,  price: 8500, discount: null },
      { minQuantity: 6,  price: 7500, discount: 11.8 },
      { minQuantity: 21, price: 6800, discount: 20 },
      { minQuantity: 51, price: 6200, discount: 27.1 },
    ],
  },
  {
    categoryName: 'Dollhouses',
    title: 'Modern Townhouse Dollhouse - Contemporary Style',
    description: 'Contemporary townhouse dollhouse with LED lighting. Popular with modern collectors and design-forward retailers.',
    price: 5200,
    stock: 38,
    imageUrl: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 2,   price: 5200, discount: null },
      { minQuantity: 11,  price: 4600, discount: 11.5 },
      { minQuantity: 41,  price: 4200, discount: 19.2 },
      { minQuantity: 101, price: 3800, discount: 26.9 },
    ],
  },
  {
    categoryName: 'Dollhouses',
    title: 'Cottage Dollhouse - Charming Country Style',
    description: 'Charming country cottage-style dollhouse. Affordable luxury for mainstream retailers and family toy stores.',
    price: 3800,
    stock: 54,
    imageUrl: 'https://images.unsplash.com/photo-1598901861713-54ad16a7e70e?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 3,   price: 3800, discount: null },
      { minQuantity: 16,  price: 3200, discount: 15.8 },
      { minQuantity: 51,  price: 2900, discount: 23.7 },
      { minQuantity: 151, price: 2600, discount: 31.6 },
    ],
  },

  // ── Accessories ────────────────────────────────────────────────────────────
  {
    categoryName: 'Accessories',
    title: 'Doll Clothing & Outfit Bundle - 10-Piece Set',
    description: 'Premium doll clothing sets with diverse styles. High-volume seller for accessory retailers and toy stores.',
    price: 280,
    stock: 890,
    imageUrl: 'https://images.unsplash.com/photo-1559563458-527298cb282e?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 20,   price: 280, discount: null },
      { minQuantity: 151,  price: 240, discount: 14.3 },
      { minQuantity: 501,  price: 210, discount: 25 },
      { minQuantity: 1201, price: 180, discount: 35.7 },
    ],
  },
  {
    categoryName: 'Accessories',
    title: 'Doll Furniture Collection - Bedroom & Living Room Set',
    description: 'Complete furniture sets for dollhouses. Essential accessory for dollhouse retailers.',
    price: 450,
    stock: 240,
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5dd?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 10,  price: 450, discount: null },
      { minQuantity: 76,  price: 380, discount: 15.6 },
      { minQuantity: 251, price: 340, discount: 24.4 },
      { minQuantity: 601, price: 300, discount: 33.3 },
    ],
  },
  {
    categoryName: 'Accessories',
    title: 'Doll Accessories Bundle - Shoes, Bags & Jewelry',
    description: 'Miniature accessories to complement doll collections. Ultra-high-volume bestseller for all toy retailers.',
    price: 180,
    stock: 1260,
    imageUrl: 'https://images.unsplash.com/photo-1560243563-062bff001d68?q=80&w=800&auto=format&fit=crop',
    tieredPricing: [
      { minQuantity: 30,   price: 180, discount: null },
      { minQuantity: 201,  price: 150, discount: 16.7 },
      { minQuantity: 801,  price: 130, discount: 27.8 },
      { minQuantity: 2001, price: 110, discount: 38.9 },
    ],
  },
];

// ─── Main Seed Function ────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Upsert categories
  console.log('📂 Seeding categories...');
  const categoryMap = {};
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where:  { name: cat.name },
      update: { description: cat.description, icon: cat.icon, isActive: true },
      create: { name: cat.name, description: cat.description, icon: cat.icon },
    });
    categoryMap[cat.name] = record.id;
    console.log(`  ✅ Category: ${cat.name}`);
  }

  // 2. Upsert products + bulk pricing
  console.log('\n📦 Seeding products...');
  for (const prod of products) {
    const categoryId = categoryMap[prod.categoryName];

    // Upsert product by title to avoid duplicates
    const existing = await prisma.product.findFirst({ where: { title: prod.title } });

    let product;
    if (existing) {
      product = await prisma.product.update({
        where: { id: existing.id },
        data: {
          title:       prod.title,
          description: prod.description,
          price:       prod.price,
          stock:       prod.stock,
          imageUrl:    prod.imageUrl,
          categoryId,
          isActive:    true,
        },
      });
      console.log(`  🔄 Updated: ${prod.title}`);
    } else {
      product = await prisma.product.create({
        data: {
          title:       prod.title,
          description: prod.description,
          price:       prod.price,
          stock:       prod.stock,
          imageUrl:    prod.imageUrl,
          categoryId,
        },
      });
      console.log(`  ✅ Created: ${prod.title}`);
    }

    // Upsert bulk pricing tiers
    for (const tier of prod.tieredPricing) {
      await prisma.bulkPrice.upsert({
        where:  { productId_minQuantity: { productId: product.id, minQuantity: tier.minQuantity } },
        update: { price: tier.price, discount: tier.discount },
        create: { productId: product.id, minQuantity: tier.minQuantity, price: tier.price, discount: tier.discount },
      });
    }
  }

  // 3. Final counts
  const [catCount, prodCount, priceCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.bulkPrice.count(),
  ]);

  console.log('\n🎉 Seed complete!');
  console.log(`   Categories : ${catCount}`);
  console.log(`   Products   : ${prodCount}`);
  console.log(`   Bulk Tiers : ${priceCount}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
