import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.findAll();
  }

  @Get(':id/tax')
  async calculateTax(@Param('id') id: string) {
    const tax = await this.productsService.calculateTaxForProduct(id);
    return { id, tax };
  }

  @Get(':id/delivery')
  async getDeliveryMethod(@Param('id') id: string) {
    const delivery = await this.productsService.getDeliveryMethodForProduct(id);
    return { id, delivery };
  }
}
