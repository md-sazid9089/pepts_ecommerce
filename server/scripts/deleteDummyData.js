const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function deleteDummyData() {
  const dummyPatterns = [
    'test', 'dummy', 'sample', 'mock', 'qa',
    'audit', 'placeholder', 'temp', 'debug',
    'deployment test product'
  ];

  const dummyProducts = await p.product.findMany({
    where: {
      OR: dummyPatterns.map(pattern => ({
        title: { contains: pattern } // Note: MySQL doesn't support 'mode: insensitive' out of the box in Prisma, we'll use default which might be CI based on collation
      }))
    },
    select: { id: true, title: true }
  });

  console.log(`\nFound ${dummyProducts.length} dummy products to delete:`);
  dummyProducts.forEach(p => console.log(`  - ${p.title} (${p.id})`));

  if (dummyProducts.length > 0) {
    const ids = dummyProducts.map(p => p.id);

    const deletedTiers = await p.bulkPrice.deleteMany({
      where: { productId: { in: ids } }
    });
    console.log(`\nDeleted ${deletedTiers.count} bulk price records`);

    const deletedOrderItems = await p.orderItem.deleteMany({
      where: { productId: { in: ids } }
    });
    console.log(`Deleted ${deletedOrderItems.count} order item records`);

    const deletedReviews = await p.review.deleteMany({
      where: { productId: { in: ids } }
    });
    console.log(`Deleted ${deletedReviews.count} review records`);

    // Inquiries don't have a strict foreign key to products but have productId
    // But schema says Inquiry has productId String? (not relation) - wait, let me check.
    // In schema.prisma: productId String?, productName String. No relation to Product.
    // So we don't need to delete by productId strictly, but we can.
    const deletedInquiries = await p.inquiry.deleteMany({
      where: { productId: { in: ids } }
    });
    console.log(`Deleted ${deletedInquiries.count} inquiry records by productId`);

    const deletedProducts = await p.product.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`Deleted ${deletedProducts.count} products`);
  } else {
    console.log('No dummy products found.');
  }

  const deletedUsers = await p.user.deleteMany({
    where: {
      OR: [
        { email: { contains: 'test' } },
        { email: { contains: 'dummy' } },
        { email: { contains: 'sample' } },
        { email: { contains: 'qa@' } },
      ],
      NOT: { role: 'admin' }
    }
  });
  console.log(`Deleted ${deletedUsers.count} test user accounts`);

  const deletedTestInquiries = await p.inquiry.deleteMany({
    where: {
      OR: [
        { companyName: { contains: 'test' } },
        { companyName: { contains: 'dummy' } },
        { message: { contains: 'test' } },
      ]
    }
  });
  console.log(`Deleted ${deletedTestInquiries.count} test inquiries`);

  console.log('\n✅ Database cleanup complete.');
  await p.$disconnect();
}

deleteDummyData().catch(console.error);
