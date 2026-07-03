import { PrismaClient, ProductKind } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const imagesDir = path.join(__dirname, '../../../apps/web/public/products');
  const files = fs.readdirSync(imagesDir);

  console.log(`Found ${files.length} files...`);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const basename = path.parse(file).name;
    const match = basename.match(/(.+?)\s*₹?\s*(\d+)(\s*\(.*\))?$/);
    
    let name = basename;
    let price = 0;

    if (match) {
      name = match[1].trim().replace(/-/g, ' ');
      price = parseFloat(match[2]);
    } else {
      name = name.replace(/-/g, ' ');
    }
    
    name = name.charAt(0).toUpperCase() + name.slice(1);

    await prisma.product.create({
      data: {
        name,
        price,
        image: `/products/${file}`,
        category: 'General',
        description: name,
        stock: 100,
        kind: ProductKind.PHYSICAL,
        weight: '1kg',
        deliveryCharge: 0
      }
    });
    console.log(`Added: ${name} - ₹${price}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
