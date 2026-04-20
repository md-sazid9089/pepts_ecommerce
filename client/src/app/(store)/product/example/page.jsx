/**
 * Example Product Detail Page for Pepta - Premium Tech & Gadget Marketplace
 */

import Image from 'next/image';
import Link from 'next/link';
import { generateProductSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';
import { PageTransition } from '@/components/Animations/LayoutTransitions';

// Sample product data - Gadget Focused
const SAMPLE_PRODUCT = {
  id: 'phone-001',
  name: 'Pepta X1 - Pro Smartphone (Global Edition)',
  slug: 'pepta-x1-pro-smartphone',
  description: 'The pinnacle of mobile technology. Features a stunning 6.9-inch OLED display, custom oct-core processor, and a revolutionary triple-lens camera system with 100x zoom.',
  images: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
  ],
  brand: 'Pepta Elite',
  manufacturer: 'Pepta Tech',
  sku: 'PP-PHONE-X1PRO-001',
  category: 'Smartphones > Flagship',
  price: 85000,
  rating: {
    average: 4.9,
    count: 2450,
  },
  reviews: [
    {
      rating: 5,
      comment: 'Top-tier build quality. The display is incredible. A big hit for our retail showrooms.',
      author: 'Marcus Chen',
      date: '2026-04-18',
    },
    {
      rating: 5,
      comment: 'Direct factory support is second to none. Pepta is our primary supplier now.',
      author: 'Ahmed Zahid',
      date: '2026-04-12',
    },
  ],
  inStock: true,
  pricing: {
    retail: 85000,
    wholesale: {
      min: 72000,
      max: 85000,
    },
    tiers: [
      {
        minQuantity: 5,
        maxQuantity: 20,
        price: 78000,
        description: 'Starter Batch',
      },
      {
        minQuantity: 21,
        maxQuantity: 100,
        price: 75000,
        description: 'Bulk Inventory',
      },
      {
        minQuantity: 101,
        maxQuantity: null,
        price: 72000,
        description: 'Showroom Partner',
      },
    ],
  },
};

// Generate breadcrumb structure
const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Smartphones', url: '/products/smartphones' },
  { label: 'Flagship', url: '/products/smartphones/flagship' },
  { label: SAMPLE_PRODUCT.name, url: `/product/${SAMPLE_PRODUCT.slug}` },
];

export default function ProductDetailPage({ params }) {
  const product = SAMPLE_PRODUCT;

  // Generate JSON-LD schemas
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        suppressHydrationWarning
      />

      <PageTransition variant="slideUp">
        <div className="container mx-auto px-6 py-12 lg:px-12">
          {/* Breadcrumb Navigation */}
          <div className="mb-10 flex items-center gap-3 text-sm text-gray-500">
            {breadcrumbItems.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3">
                <Link href={item.url} className="hover:text-black transition-colors">
                  {item.label}
                </Link>
                {index < breadcrumbItems.length - 1 && (
                  <span className="opacity-40">/</span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:opacity-70 transition-opacity border border-gray-100">
                    <Image src={image} alt="" fill className="object-cover p-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">
                  {product.brand}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    SKU: {product.sku}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">★★★★★</span>
                    <span className="text-sm text-gray-500 font-medium">({product.rating.count} Verified Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mb-10 pb-10 border-b border-gray-100">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    BDT {product.pricing.tiers[0].price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through">
                    BDT {product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 leading-relaxed md:text-lg">
                  {product.description}
                </p>
              </div>

              {/* Wholesale Tiers */}
              <div className="mb-12">
                <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">
                  WHOLESALE PRICING TIERS
                </h3>
                <div className="space-y-3">
                  {product.pricing.tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-default"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{tier.description}</span>
                        <span className="text-xs text-gray-500">
                          {tier.minQuantity} - {tier.maxQuantity || 'Unlimited'} Units
                        </span>
                      </div>
                      <span className="text-xl font-black text-gray-900">
                        BDT {tier.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95">
                  Start Bulk Order
                </button>
                <button className="px-8 border border-gray-200 text-gray-900 font-bold py-5 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export const metadata = {
  title: `${SAMPLE_PRODUCT.name} - Buy Wholesale Gadgets | Pepta`,
  description: SAMPLE_PRODUCT.description,
  keywords: [
    'wholesale smartphones',
    'pepta tech',
    'buy phones in bulk',
    'electronics supplier',
  ],
};
