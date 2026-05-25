import prisma from '../src/lib/prisma.js';

async function auditData() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        isActive: true,
        imageUrl: true,
        images: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const inquiries = await prisma.inquiry.findMany({
      select: { id: true, companyName: true, createdAt: true },
    });

    const orders = await prisma.order.findMany({
      select: { id: true, createdAt: true, status: true },
    });

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });

    console.log('\n========== DATA AUDIT REPORT ==========\n');

    console.log(`PRODUCTS (${products.length} total):`);
    products.forEach((product, i) => {
      const hasRealImage =
        product.imageUrl?.includes('cloudinary.com') ||
        product.images?.some((img) => img.includes('cloudinary.com'));
      const isTest =
        product.title.toLowerCase().includes('test') ||
        product.title.toLowerCase().includes('dummy') ||
        product.title.toLowerCase().includes('sample') ||
        product.title.toLowerCase().includes('mock') ||
        product.title.toLowerCase().includes('qa') ||
        product.title.toLowerCase().includes('audit');
      console.log(
        `  ${i + 1}. [${isTest ? '🗑️  DUMMY' : '✅ REAL '}] ${product.title} | Image: ${hasRealImage ? '✅' : '❌'} | Created: ${product.createdAt}`
      );
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
  } catch (error) {
    console.error('Audit Error:', error.message);
    process.exit(1);
  }
}

auditData();
