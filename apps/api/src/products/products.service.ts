import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, PhysicalProduct, DigitalProduct, SubscriptionProduct } from './entities/product.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToOOPClass(dbProduct: any): Product {
    let instance: Product;
    switch (dbProduct.kind) {
      case 'PHYSICAL':
        instance = new PhysicalProduct(
          dbProduct.id, dbProduct.name, dbProduct.description || '', dbProduct.price, dbProduct.category, dbProduct.stock, dbProduct.image, 
          dbProduct.weight ? parseFloat(dbProduct.weight) : 0, 
          dbProduct.deliveryCharge || 0
        );
        break;
      case 'DIGITAL':
        instance = new DigitalProduct(
          dbProduct.id, dbProduct.name, dbProduct.description || '', dbProduct.price, dbProduct.category, dbProduct.stock, dbProduct.image, 
          dbProduct.licenseKey || ''
        );
        break;
      case 'SUBSCRIPTION':
        instance = new SubscriptionProduct(
          dbProduct.id, dbProduct.name, dbProduct.description || '', dbProduct.price, dbProduct.category, dbProduct.stock, dbProduct.image, 
          dbProduct.renewalPeriod || 'Monthly'
        );
        break;
      default:
        throw new Error(`Unknown product kind: ${dbProduct.kind}`);
    }
    
    // Append the discriminator dynamically for the frontend serialization
    (instance as any).kind = dbProduct.kind;
    return instance;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(p => this.mapToOOPClass(p));
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return this.mapToOOPClass(product);
  }

  // Notice how we DO NOT use instanceof. We rely purely on polymorphism!
  async calculateTaxForProduct(id: string): Promise<number> {
    const product = await this.findById(id);
    return product.calculateTax();
  }

  async getDeliveryMethodForProduct(id: string): Promise<string> {
    const product = await this.findById(id);
    return product.deliveryMethod();
  }
}
