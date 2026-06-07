import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { Email: 'admin@jomoro.com' }, 
    update: {},
    create: {
      Email: 'admin@jomoro.com',
      first_name: 'Admin',
      last_name: 'Jomoro',
      password: 'PasswordAdmin12', 
      role: 'Admin',
    },
  });

  const customer = await prisma.user.upsert({
    where: { Email: 'customer@jomoro.id' },
    update: {},
    create: {
      Email: 'customer@jomoro.id',
      first_name: 'Arif',
      last_name: 'Kurniawan',
      password: 'PasswordUser34', 
      role: 'Customer',
    },
  });

  console.log('Seeding auth-service berhasil:', { admin, customer });
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