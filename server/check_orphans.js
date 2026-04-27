
import prisma from './src/lib/prisma.js';

async function checkOrphans() {
  try {
    const prices = await prisma.bulkPrice.findMany();
    const products = await prisma.product.findMany({ select: { id: true } });
    const productIds = new Set(products.map((p) => p.id));
    const orphans = prices.filter((p) => !productIds.has(p.productId));

    console.log('\n========== ORPHAN BULK PRICES CHECK ==========\n');

    if (orphans.length === 0) {
      console.log('✅ SUCCESS: No orphaned bulk prices found\n');
    } else {
      console.log(`❌ ORPHANS FOUND: ${orphans.length} bulk price(s) with non-existent products\n`);
      orphans.forEach((orphan, i) => {
        console.log(`  ${i + 1}. Bulk Price ID: ${orphan.id} | Product ID: ${orphan.productId}`);
      });
    }

    console.log('\n=============================================\n');
  } catch (error) {
    console.error('Orphan Check Error:', error.message);
    process.exit(1);
  }
}

checkOrphans();
