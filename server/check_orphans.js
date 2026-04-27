
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const prices = await prisma.bulkPrice.findMany();
  const products = await prisma.product.findMany({ select: { id: true } });
  const productIds = new Set(products.map(p => p.id));
  const orphans = prices.filter(p => !productIds.has(p.productId));
  console.log(orphans.length === 0 ? '✅ SUCCESS' : '❌ ORPHANS FOUND');
  if (orphans.length > 0) console.log(orphans);
}

check().catch(e => console.error(e)).finally(() => prisma.$disconnect());
