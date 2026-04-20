#!/usr/bin/env node

/**
 * Phase 1 Implementation Validator
 * Checks all optimizations are correctly implemented
 * Run: node scripts/validate-phase1.js
 */

const fs = require('fs');
const path = require('path');

const checks = [];
let passCount = 0;
let failCount = 0;

function check(name, condition, details = '') {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);
  if (condition) passCount++;
  else failCount++;
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  check(`${description} exists`, exists, filePath);
  return exists;
}

function checkFileContains(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    check(`${description}`, false, `File not found: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const found = content.includes(searchString);
  check(`${description}`, found, filePath);
  return found;
}

console.log('\n📋 PHASE 1 IMPLEMENTATION VALIDATION\n');
console.log('=' .repeat(50) + '\n');

// 1. Check API Client
console.log('📁 Data Layer: API Client\n');
checkFileExists(
  'src/utils/api.js',
  'API Client utility'
);
checkFileContains(
  'src/utils/api.js',
  'exponential backoff',
  'Exponential backoff implementation'
);
checkFileContains(
  'src/utils/api.js',
  'Stale-While-Revalidate',
  'Stale-While-Revalidate pattern'
);
checkFileContains(
  'src/utils/api.js',
  'MAX_RETRIES',
  'Retry logic configuration'
);
checkFileContains(
  'src/utils/api.js',
  'isRetryableError',
  'Retryable error detection'
);

// 2. Check Image Optimization
console.log('\n📁 Image Optimization: next/image Migration\n');
checkFileContains(
  'src/components/ProductCard/ProductCard.premium.jsx',
  "import Image from 'next/image'",
  'ProductCard.premium imports next/image'
);
checkFileContains(
  'src/components/ProductCard/ProductCard.premium.jsx',
  'width={300}',
  'ProductCard.premium has explicit width'
);
checkFileContains(
  'src/components/ProductCard/ProductCard.premium.jsx',
  'height={300}',
  'ProductCard.premium has explicit height'
);
checkFileContains(
  'src/components/ProductCard/ProductCard.premium.jsx',
  'unoptimized={product.image.includes(\'placehold.co\')}',
  'ProductCard.premium handles placehold.co'
);

checkFileContains(
  'src/components/QuickViewModal/QuickViewModal.jsx',
  "import Image from 'next/image'",
  'QuickViewModal imports next/image'
);
checkFileContains(
  'src/components/QuickViewModal/QuickViewModal.jsx',
  'width={600}',
  'QuickViewModal main image has width'
);
checkFileContains(
  'src/components/QuickViewModal/QuickViewModal.jsx',
  'width={100}',
  'QuickViewModal thumbnails have width'
);
checkFileContains(
  'src/components/QuickViewModal/QuickViewModal.jsx',
  'height={100}',
  'QuickViewModal thumbnails have height'
);

// 3. Check Infrastructure
console.log('\n📁 Infrastructure: next.config.js\n');
checkFileContains(
  'next.config.js',
  "formats: ['image/avif', 'image/webp']",
  'AVIF image format support enabled'
);
checkFileContains(
  'next.config.js',
  "'/_next/static/:path*'",
  'Caching headers for /_next/static'
);
checkFileContains(
  'next.config.js',
  "'/public/:path*'",
  'Caching headers for /public'
);
checkFileContains(
  'next.config.js',
  'max-age=31536000',
  '1-year immutable cache header'
);
checkFileContains(
  'next.config.js',
  'immutable',
  'Immutable cache directive'
);

// 4. Check Performance Monitor
console.log('\n📁 Monitoring: Performance Monitor\n');
checkFileExists(
  'src/utils/performanceMonitor.js',
  'Performance monitor utility'
);
checkFileContains(
  'src/utils/performanceMonitor.js',
  'trackImageLoad',
  'Image performance tracking'
);
checkFileContains(
  'src/utils/performanceMonitor.js',
  'trackApiRequest',
  'API performance tracking'
);
checkFileContains(
  'src/utils/performanceMonitor.js',
  'Core Web Vitals',
  'Core Web Vitals monitoring'
);

// 5. Check Documentation
console.log('\n📁 Documentation\n');
checkFileExists(
  'PHASE_1_IMPLEMENTATION.md',
  'Phase 1 implementation report'
);

console.log('\n' + '='.repeat(50) + '\n');
console.log(`Results: ${passCount} ✅ | ${failCount} ❌\n`);

if (failCount === 0) {
  console.log('🎉 All Phase 1 checks passed!\n');
  console.log('Next steps:');
  console.log('1. npm run build');
  console.log('2. npm run dev');
  console.log('3. Test in browser DevTools');
  console.log('4. Verify caching headers: curl -i http://localhost:3000/_next/static/...');
  console.log('5. Deploy to staging\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failCount} check(s) failed. Please review the errors above.\n`);
  process.exit(1);
}
