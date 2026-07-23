export abstract class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.image = image;
  }

  // Abstract methods required by the SRS
  abstract calculateTax(): number;
  abstract checkAvailability(): boolean;
  abstract deliveryMethod(): string;
}

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

export class DigitalProduct extends Product {
  licenseKey: string;
  instantDownload: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: string,
    licenseKey: string,
    instantDownload: boolean = true
  ) {
    super(id, name, description, price, category, stock, image);
    this.licenseKey = licenseKey;
    this.instantDownload = instantDownload;
  }

  calculateTax(): number {
    // 18% GST tax on digital goods
    return this.price * 0.18;
  }

  checkAvailability(): boolean {
    // Digital products are always available (infinite stock logically, but we use the boolean)
    return this.instantDownload;
  }

  deliveryMethod(): string {
    return `Instant email delivery. License Key provided upon payment completion.`;
  }
}

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
