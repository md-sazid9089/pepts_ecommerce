import prisma from '../src/lib/prisma.js';

async function deleteDummyData() {
  try {
    const dummyPatterns = [
      'test',
      'dummy',
      'sample',
      'mock',
      'qa',
      'audit',
      'placeholder',
      'temp',
      'debug',
      'deployment test product',
    ];

    const dummyProducts = await prisma.product.findMany({
      where: {
        OR: dummyPatterns.map((pattern) => ({
          title: { contains: pattern },
        })),
      },
      select: { id: true, title: true },
    });

    console.log(`\n========== DUMMY DATA DELETION ==========\n`);
    console.log(`Found ${dummyProducts.length} dummy products to delete:`);
    dummyProducts.forEach((product) => console.log(`  - ${product.title} (${product.id})`));

    if (dummyProducts.length > 0) {
      const ids = dummyProducts.map((product) => product.id);

      const deletedTiers = await prisma.bulkPrice.deleteMany({
        where: { productId: { in: ids } },
      });
      console.log(`\nDeleted ${deletedTiers.count} bulk price records`);

      const deletedOrderItems = await prisma.orderItem.deleteMany({
        where: { productId: { in: ids } },
      });
      console.log(`Deleted ${deletedOrderItems.count} order item records`);

      const deletedReviews = await prisma.review.deleteMany({
        where: { productId: { in: ids } },
      });
      console.log(`Deleted ${deletedReviews.count} review records`);

      const deletedInquiries = await prisma.inquiry.deleteMany({
        where: { productId: { in: ids } },
      });
      console.log(`Deleted ${deletedInquiries.count} inquiry records by productId`);

      const deletedProducts = await prisma.product.deleteMany({
        where: { id: { in: ids } },
      });
      console.log(`Deleted ${deletedProducts.count} products`);
    } else {
      console.log('No dummy products found.');
    }

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test' } },
          { email: { contains: 'dummy' } },
          { email: { contains: 'sample' } },
          { email: { contains: 'qa@' } },
        ],
        NOT: { role: 'admin' },
      },
    });
    console.log(`Deleted ${deletedUsers.count} test user accounts`);

    const deletedTestInquiries = await prisma.inquiry.deleteMany({
      where: {
        OR: [
          { companyName: { contains: 'test' } },
          { companyName: { contains: 'dummy' } },
          { message: { contains: 'test' } },
        ],
      },
    });
    console.log(`Deleted ${deletedTestInquiries.count} test inquiries`);

    console.log('\n✅ Database cleanup complete.\n');
  } catch (error) {
    console.error('Deletion Error:', error.message);
    process.exit(1);
  }
}

deleteDummyData();
