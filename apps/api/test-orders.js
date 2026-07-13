const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  orders.forEach(o => console.log('Order:', o.id, 'CustomerStr:', o.customerId));
}

main().catch(console.error).finally(() => prisma.$disconnect());
