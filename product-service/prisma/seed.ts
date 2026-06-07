import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Kopi Susu Premium',
    },
  });

  const product = await prisma.product.create({
    data: {
      name: 'Jomoro Aren Latte', 
      description: 'Perpaduan espresso espresso lokal berkualitas dengan susu segar dan gula aren asli.', 
      price: 22000,
      stock: 150,
      category_id: category.id,
    },
  });

  console.log('Seeding product-service berhasil:', { category, product });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });