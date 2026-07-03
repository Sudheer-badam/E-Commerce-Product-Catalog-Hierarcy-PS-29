import { Product } from './Product';

export class PhysicalProduct extends Product {
  weight: number;
  deliveryCharges: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: string,
    weight: number,
    deliveryCharges: number
  ) {
    super(id, name, description, price, category, stock, image);
    this.weight = weight;
    this.deliveryCharges = deliveryCharges;
  }

  calculateTax(): number {
    // Standard 18% tax on physical goods
    return this.price * 0.18;
  }

  checkAvailability(): boolean {
    return this.stock > 0;
  }

  deliveryMethod(): string {
    return `Shipping via courier. Charges: $${this.deliveryCharges}, Weight: ${this.weight}kg`;
  }
}
