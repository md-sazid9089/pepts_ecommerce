const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function auditData() {
  const products = await p.product.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      isActive: true,
      imageUrl: true,
      images: true
    },
    orderBy: { createdAt: 'asc' },
  });

  const inquiries = await p.inquiry.findMany({
    select: { id: true, companyName: true, createdAt: true }
  });

  const orders = await p.order.findMany({
    select: { id: true, createdAt: true, status: true }
  });

  const users = await p.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true }
  });

  console.log('\n========== DATA AUDIT REPORT ==========\n');

  console.log(`PRODUCTS (${products.length} total):`);
  products.forEach((p, i) => {
    const hasRealImage = p.imageUrl?.includes('cloudinary.com') || p.images?.includes('cloudinary.com');
    const isTest = p.title.toLowerCase().includes('test') ||
                   p.title.toLowerCase().includes('dummy') ||
                   p.title.toLowerCase().includes('sample') ||
                   p.title.toLowerCase().includes('mock') ||
                   p.title.toLowerCase().includes('qa') ||
                   p.title.toLowerCase().includes('audit');
    console.log(`  ${i + 1}. [${isTest ? '🗑️  DUMMY' : '✅ REAL '}] ${p.title} | Image: ${hasRealImage ? '✅' : '❌'} | Created: ${p.createdAt}`);
  });

  console.log(`\nINQUIRIES (${inquiries.length} total):`);
  inquiries.forEach((inq, i) => {
    console.log(`  ${i + 1}. ${inq.companyName} | Created: ${inq.createdAt}`);
  });

  console.log(`\nORDERS (${orders.length} total):`);
  orders.forEach((o, i) => {
    console.log(`  ${i + 1}. Status: ${o.status} | Created: ${o.createdAt}`);
  });

  console.log(`\nUSERS (${users.length} total):`);
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} | Role: ${u.role} | Created: ${u.createdAt}`);
  });

  console.log('\n========================================\n');
  await p.$disconnect();
}

auditData().catch(console.error);
