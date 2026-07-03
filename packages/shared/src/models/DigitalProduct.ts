import { Product } from './Product';

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
