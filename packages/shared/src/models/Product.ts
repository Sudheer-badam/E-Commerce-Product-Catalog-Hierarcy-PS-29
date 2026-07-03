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
