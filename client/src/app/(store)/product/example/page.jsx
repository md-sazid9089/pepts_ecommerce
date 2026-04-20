/**
 * Example Product Detail Page with JSON-LD SEO Integration
 * Shows how to use the schema generator on product pages
 */

import { generateProductSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';
import { PageTransition } from '@/components/Animations/LayoutTransitions';

// Sample product data (would come from database)
const SAMPLE_PRODUCT = {
  id: 'doll-001',
  name: 'Premium Victorian Doll Collection',
  slug: 'premium-victorian-doll-collection',
  description: 'Handcrafted Victorian-era inspired dolls with authentic period clothing and accessories. Perfect for collectors and gift shops.',
  images: [
    'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
  ],
  brand: 'Pepta Artisan',
  manufacturer: 'Pepta',
  sku: 'PP-DOLL-VICTORIAN-001',
  category: 'Dolls > Victorian',
  price: 2500,
  rating: {
    average: 4.8,
    count: 156,
  },
  reviews: [
    {
      rating: 5,
      comment: 'Absolutely beautiful! Excellent craftsmanship. Highly recommend for resellers.',
      author: 'Sarah Johnson',
      date: '2026-04-15',
    },
    {
      rating: 5,
      comment: 'Authentic details, perfect packaging, fast shipping. Will order again!',
      author: 'Emma Wilson',
      date: '2026-04-10',
    },
  ],
  inStock: true,
  pricing: {
    retail: 2500,
    wholesale: {
      min: 2200,
      max: 2500,
    },
    tiers: [
      {
        minQuantity: 10,
        maxQuantity: 50,
        price: 2200,
        description: '10-50 units',
      },
      {
        minQuantity: 51,
        maxQuantity: 200,
        price: 1950,
        description: '51-200 units',
      },
      {
        minQuantity: 201,
        maxQuantity: null,
        price: 1700,
        description: '200+ units',
      },
    ],
  },
};

// Generate breadcrumb structure
const breadcrumbItems = [
  { label: 'Home', url: 'https://precious-play-wholesale.com' },
  { label: 'Products', url: 'https://precious-play-wholesale.com/products' },
  { label: 'Dolls', url: 'https://precious-play-wholesale.com/products/dolls' },
  { label: 'Victorian', url: 'https://precious-play-wholesale.com/products/dolls/victorian' },
  { label: SAMPLE_PRODUCT.name, url: `https://precious-play-wholesale.com/product/${SAMPLE_PRODUCT.slug}` },
];

/**
 * Product Detail Page Component
 * Demonstrates schema integration
 */
export default function ProductDetailPage({ params }) {
  // In real implementation, fetch product from database
  const product = SAMPLE_PRODUCT;

  // Generate JSON-LD schemas
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* Inject JSON-LD schemas into page head */}
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

      {/* Page Content with Animation */}
      <PageTransition variant="slideUp">
        <div className="py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            {breadcrumbItems.map((item, index) => (
              <div key={item.url} className="flex items-center gap-2">
                <a href={item.url} className="hover:text-purple-600">
                  {item.label}
                </a>
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-gray-400">/</span>
                )}
              </div>
            ))}
          </div>

          {/* Product Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <div key={image} className="aspect-square bg-gray-100 rounded cursor-pointer hover:opacity-70">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Brand */}
              <div>
                <p className="text-purple-600 font-semibold mb-2">{product.brand}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">SKU: {product.sku}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating.average)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.average} ({product.rating.count} reviews)
                </span>
              </div>

              {/* Stock Status */}
              <div>
                {product.inStock ? (
                  <p className="text-green-600 font-semibold flex items-center gap-2">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p>{product.description}</p>
              </div>

              {/* Pricing Tiers */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Wholesale Pricing</h3>
                <div className="space-y-3">
                  {product.pricing.tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{tier.description}</p>
                        <p className="text-sm text-gray-600">
                          {tier.minQuantity} - {tier.maxQuantity || 'unlimited'} units
                        </p>
                      </div>
                      <p className="text-lg font-bold text-purple-600">৳{tier.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
                  Add to Cart
                </button>
                <button className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-lg transition">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

/**
 * Metadata for SEO
 */
export const metadata = {
  title: `${SAMPLE_PRODUCT.name} - Buy Wholesale Dolls | Pepta`,
  description: SAMPLE_PRODUCT.description,
  keywords: [
    'wholesale dolls',
    SAMPLE_PRODUCT.category,
    'buy dolls in bulk',
    'doll supplier',
  ],
  openGraph: {
    title: SAMPLE_PRODUCT.name,
    description: SAMPLE_PRODUCT.description,
    images: [{ url: SAMPLE_PRODUCT.images[0] }],
    type: 'product',
  },
};
