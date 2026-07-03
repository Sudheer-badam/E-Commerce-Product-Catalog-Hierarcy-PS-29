import { Product } from './Product';

export class SubscriptionProduct extends Product {
  renewalPeriod: 'Monthly' | 'Quarterly' | 'Yearly';
  autoRenewal: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: string,
    renewalPeriod: 'Monthly' | 'Quarterly' | 'Yearly',
    autoRenewal: boolean = true
  ) {
    super(id, name, description, price, category, stock, image);
    this.renewalPeriod = renewalPeriod;
    this.autoRenewal = autoRenewal;
  }

  calculateTax(): number {
    // 18% GST tax on subscriptions
    return this.price * 0.18;
  }

  checkAvailability(): boolean {
    return true; // Subscriptions are always available
  }

  deliveryMethod(): string {
    return `Account activation upon payment. Renews ${this.renewalPeriod.toLowerCase()}.`;
  }
}
