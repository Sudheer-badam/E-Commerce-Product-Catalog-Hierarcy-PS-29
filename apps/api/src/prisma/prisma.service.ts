import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    // Seed some mock data on startup if empty
    const count = await this.product.count();
    if (count === 0) {
      await this.product.createMany({
        data: [
          {
            name: 'Neon Postgres DB Instance',
            price: 99.99,
            image: '🐘',
            category: 'Database',
            description: 'Serverless Postgres database built for modern developers.',
            stock: 999,
            kind: 'DIGITAL',
            licenseKey: 'NEON-12345-XYZ',
            downloadUrl: 'https://neon.tech',
          },
          {
            name: 'Developer Workstation',
            price: 2499.00,
            image: '💻',
            category: 'Electronics',
            description: 'High-performance laptop for compiling code fast.',
            stock: 12,
            kind: 'PHYSICAL',
            weight: '2.4kg',
            deliveryCharge: 20.0,
          }
        ]
      });
      console.log('Seeded Neon Database with initial products.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
