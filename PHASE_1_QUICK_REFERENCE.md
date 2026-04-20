# Phase 1 Quick Reference Guide

## 🚀 Getting Started

### 1. Build & Deploy

```bash
# Terminal 1: Install dependencies (if needed)
cd client
npm install

# Build production-ready code
npm run build

# Test locally
npm run dev
```

Visit: http://localhost:3000

### 2. Validate Implementation

```bash
# Run validation checks
node scripts/validate-phase1.js
```

Expected output: All ✅ checks passing

### 3. Test in Browser

**Open Chrome DevTools → Network Tab:**

1. **Check Caching Headers**
   - Click on any `.js` file under `_next/static`
   - Response Headers should show: `Cache-Control: public, max-age=31536000, immutable`

2. **Check Image Optimization**
   - Look at image requests
   - Should see `.jpg`, `.webp`, or `.avif` formats
   - No `placehold.co` timeout errors
   - Images have explicit dimensions

3. **Check Core Web Vitals**
   - Lighthouse tab → Run audit
   - Target scores: LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## 📚 Using the New APIs

### API Client with Retry Logic

**File**: `src/utils/api.js`

```javascript
import { apiClient } from '@/utils/api';

// Simple GET (auto-cached & retried)
const products = await apiClient.get('/api/products');

// GET with options
const user = await apiClient.get('/api/user', {
  headers: { 'Authorization': 'Bearer token' }
});

// POST (auto-retried on failure)
const order = await apiClient.post('/api/orders', {
  items: cartItems,
  total: 1500
});

// Handle errors
try {
  const data = await apiClient.get('/api/data');
} catch (error) {
  console.error('Request failed after 3 retries:', error);
}

// Check cache stats
const stats = apiClient.getStats();
console.log(`${stats.cacheSize} items in cache`);

// Clear cache for specific endpoint
apiClient.clearCache('/api/products');

// Clear all cache
apiClient.clearCache();
```

**Features:**
- ✅ Automatic retry (up to 3 times)
- ✅ Exponential backoff (300ms, 600ms, 1200ms)
- ✅ Stale-While-Revalidate pattern (5-min cache)
- ✅ Request deduplication
- ✅ Graceful error handling

---

### Performance Monitor

**File**: `src/utils/performanceMonitor.js`

```javascript
import { performanceMonitor } from '@/utils/performanceMonitor';

// Track image load (in Image component)
performanceMonitor.trackImageLoad(
  '/images/product.jpg',
  300,          // width
  300,          // height
  'webp',       // format
  245           // load time in ms
);

// Track API request
performanceMonitor.trackApiRequest(
  '/api/products',    // endpoint
  200,                // status
  156,                // duration in ms
  0                   // retries
);

// Get comprehensive report
const report = performanceMonitor.getReport();
console.log(report);
// Output:
// {
//   timestamp: "2026-04-20T10:30:45.123Z",
//   metrics: { ... },
//   summary: {
//     totalApiCalls: 42,
//     totalImageLoads: 128,
//     avgImageLoadTime: 245,
//     coreWebVitals: { lcp: {...}, cls: {...} }
//   }
// }

// Log to console for debugging
performanceMonitor.logReport();

// Send to analytics endpoint
await performanceMonitor.sendMetrics('/api/metrics');
```

---

## 🖼️ Image Optimization

### Using next/image in Components

```jsx
import Image from 'next/image';

// Basic usage (required: width, height)
<Image
  src="/images/product.jpg"
  alt="Product name"
  width={300}
  height={300}
/>

// With lazy loading
<Image
  src="/images/product.jpg"
  alt="Product name"
  width={300}
  height={300}
  loading="lazy"
/>

// With placeholder image
<Image
  src="/images/product.jpg"
  alt="Product name"
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/svg+xml,%3Csvg..."
/>

// For placehold.co (add unoptimized={true})
<Image
  src="https://placehold.co/300x300?text=Product"
  alt="Placeholder"
  width={300}
  height={300}
  unoptimized={true}
  loading="lazy"
/>

// With error handling
<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  onError={(e) => console.error('Image failed to load', e)}
/>
```

**Important Rules:**
- ✅ Always specify `width` and `height` (prevents CLS)
- ✅ Use `unoptimized={true}` only for placehold.co
- ✅ Use `loading="lazy"` for images below the fold
- ✅ Use `loading="eager"` for hero/above-the-fold images
- ✅ Add `alt` text for accessibility

---

## 🧪 Testing Checklist

### Before Deployment

- [ ] Run validation script: `node scripts/validate-phase1.js`
- [ ] Build project: `npm run build`
- [ ] Test locally: `npm run dev`
- [ ] Check in DevTools:
  - [ ] Images load without errors
  - [ ] No placehold.co timeout warnings
  - [ ] Cache headers present on static assets
  - [ ] Network tab shows WebP/AVIF formats (where supported)
- [ ] Run Lighthouse audit (Ctrl+Shift+P → Lighthouse)
  - [ ] Performance score > 80
  - [ ] CLS < 0.1
  - [ ] LCP < 2.5s
- [ ] Test API retry logic (DevTools Network → throttle to "Slow 3G")
- [ ] Verify all images have explicit dimensions

### Performance Metrics

After deployment, monitor:

```bash
# Check cache headers
curl -i http://yoursite.com/_next/static/[filename].js

# Expected response header:
# Cache-Control: public, max-age=31536000, immutable
```

---

## 📊 Key Metrics

### Expected Performance Gains

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Page Load** | 8-10s | 4-5s | ✅ |
| **Repeat Visit** | 8-10s | 2-3s | ✅ |
| **Image Size** | 450KB | 300KB | ✅ |
| **API Success Rate** | 80% | 97% | ✅ |
| **CLS Score** | 0.15-0.25 | < 0.1 | ✅ |

---

## 🐛 Troubleshooting

### Images Not Showing

```javascript
// Verify image URL is in remotePatterns
// next.config.js should include:
remotePatterns: [
  { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
]
```

### "Image is larger than ... pixels" Warning

```javascript
// Add sizes prop for responsive images
<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Caching Not Working

```bash
# Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear site data:
# DevTools → Application → Clear storage → Clear all
```

### API Requests Still Failing

```javascript
// Check retry stats
apiClient.getStats().pendingRequests
// Should show 0 after requests complete

// Verify error is retryable (5xx, 408, 429)
// Non-retryable: 404, 403, etc.
```

---

## 📞 Support

**Issues?**

1. Check: `node scripts/validate-phase1.js` output
2. Review: `PHASE_1_IMPLEMENTATION.md`
3. Check browser console for errors
4. Verify network requests in DevTools

---

## 🎯 Next Steps

**Week 1**: Monitor performance metrics

**Week 2**: Begin Phase 2 (Icon optimization, error boundaries)

**Week 3**: Add performance monitoring dashboard

---

**Version**: Phase 1 - Complete  
**Last Updated**: April 20, 2026  
**Status**: Ready for Deployment ✅
