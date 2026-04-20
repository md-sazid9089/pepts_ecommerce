/**
 * JSON-LD Schema Generator for SEO
 * Generates structured data for Product, Review, and AggregateRating schema
 * Automatically injects into product detail pages
 */

/**
 * Generate Product Schema
 * @param {Object} product - Product data
 * @returns {Object} JSON-LD Product schema
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: Array.isArray(product.images) ? product.images : [product.images],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Pepta',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'Pepta',
      url: 'https://precious-play-wholesale.com',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BDT',
      lowPrice: product.pricing?.wholesale?.min || product.price,
      highPrice: product.pricing?.wholesale?.max || product.price,
      offerCount: product.pricing?.tiers?.length || 1,
      offers: generatePricingOffers(product.pricing),
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: product.reviews
      ? product.reviews.slice(0, 5).map((review) => generateReviewSchema(review))
      : undefined,
    sku: product.sku,
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `https://precious-play-wholesale.com/product/${product.slug}`,
    category: product.category,
    potentialAction: {
      '@type': 'TradeAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://precious-play-wholesale.com/cart?add=${product.id}`,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
      },
    },
  };
}

/**
 * Generate Pricing Offers from tiers
 * @param {Object} pricing - Pricing object with tiers
 * @returns {Array} Array of Offer schemas
 */
function generatePricingOffers(pricing) {
  if (!pricing?.tiers || pricing.tiers.length === 0) {
    return [];
  }

  return pricing.tiers.map((tier) => ({
    '@type': 'Offer',
    priceCurrency: 'BDT',
    price: tier.price,
    priceValidUntil: tier.validUntil || '2026-12-31',
    itemCondition: 'https://schema.org/NewCondition',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Pepta',
    },
    description: `Buy ${tier.minQuantity}-${tier.maxQuantity || 'unlimited'} units at ${tier.price} BDT each`,
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      minValue: tier.minQuantity,
      maxValue: tier.maxQuantity,
      unitCode: 'C62',
    },
  }));
}

/**
 * Generate Review Schema
 * @param {Object} review - Review data
 * @returns {Object} JSON-LD Review schema
 */
export function generateReviewSchema(review) {
  return {
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.author || 'Anonymous Reviewer',
    },
    reviewBody: review.comment,
    datePublished: review.date || new Date().toISOString(),
  };
}

/**
 * Generate AggregateRating Schema
 * @param {Object} product - Product with rating data
 * @returns {Object} JSON-LD AggregateRating schema
 */
export function generateAggregateRatingSchema(product) {
  if (!product.rating) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    name: `${product.name} Reviews`,
    ratingValue: product.rating.average,
    ratingCount: product.rating.count,
    reviewCount: product.reviews?.length || 0,
    bestRating: 5,
    worstRating: 1,
  };
}

/**
 * Generate Breadcrumb Schema
 * @param {Array} items - Breadcrumb items [{label, url}]
 * @returns {Object} JSON-LD BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization Schema
 * @returns {Object} JSON-LD Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pepta',
    url: 'https://pepta.com',
    logo: 'https://pepta.com/images/logo.png',
    description: 'Premium doll wholesale supplier for boutiques and gift shops. Direct factory prices, tiered pricing, and verified manufacturers across Bangladesh.',
    sameAs: [
      'https://facebook.com/pepta',
      'https://instagram.com/pepta',
      'https://twitter.com/pepta',
      'https://tiktok.com/@preciousplay',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1XXX-XXXXXX',
      contactType: 'Customer Service',
      areaServed: 'BD',
      availableLanguage: 'en',
      email: 'support@precious-play-wholesale.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka Division',
      postalCode: '1000-1500',
      streetAddress: 'Pepta Hub, Dhaka, Bangladesh',
    },
    foundingDate: '2023',
    foundingLocation: 'Dhaka, Bangladesh',
    areaServed: 'BD',
    knowsAbout: ['Wholesale Toys', 'Dolls', 'B2B E-Commerce', 'Bulk Sales'],
  };
}

/**
 * Generate FAQPage Schema
 * @param {Array} faqs - FAQ items [{question, answer}]
 * @returns {Object} JSON-LD FAQPage schema
 */
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness Schema
 * @returns {Object} JSON-LD LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pepta',
    url: 'https://pepta.com',
    image: 'https://pepta.com/images/logo.png',
    description: 'B2B doll wholesale marketplace',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pepta Hub',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka Division',
      postalCode: '1000-1500',
      addressCountry: 'BD',
    },
    telephone: '+880-1XXX-XXXXXX',
    email: 'support@precious-play-wholesale.com',
    areaServed: ['BD', 'Asia'],
    priceRange: '৳৳',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 156,
    },
  };
}

/**
 * Inject JSON-LD script into page
 * @param {Object} schema - JSON-LD schema object
 * @returns {Object} Script tag props for Next.js
 */
export function createJsonLdScript(schema) {
  return {
    __html: JSON.stringify(schema),
  };
}

export default {
  generateProductSchema,
  generateReviewSchema,
  generateAggregateRatingSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  createJsonLdScript,
};
