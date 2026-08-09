import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categorySeed = [
  { name: 'Electronics', description: 'Gadgets, accessories and devices' },
  { name: 'Fashion', description: 'Clothing and accessories' },
  { name: 'Books', description: 'Fiction, non-fiction and academic books' },
  { name: 'Home & Kitchen', description: 'Everyday home and kitchen essentials' },
  { name: 'Sports & Outdoors', description: 'Sports gear and outdoor equipment' },
];

const productSeed = [
  { title: 'Wireless Mouse', description: 'Ergonomic 2.4GHz wireless mouse with adjustable DPI.', price: 550, stock: 40, category: 'Electronics' },
  { title: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with blue switches.', price: 3200, stock: 20, category: 'Electronics' },
  { title: 'Bluetooth Earbuds', description: 'True wireless earbuds with noise isolation.', price: 1800, stock: 35, category: 'Electronics' },
  { title: 'Power Bank 20000mAh', description: 'Fast-charging portable power bank, dual USB output.', price: 1600, stock: 50, category: 'Electronics' },
  { title: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI, SD card reader and USB 3.0.', price: 1200, stock: 25, category: 'Electronics' },
  { title: 'Cotton Casual Shirt', description: 'Breathable 100% cotton shirt, regular fit.', price: 850, stock: 60, category: 'Fashion' },
  { title: 'Denim Jacket', description: 'Classic blue denim jacket, unisex fit.', price: 2200, stock: 15, category: 'Fashion' },
  { title: 'Leather Wallet', description: 'Genuine leather bifold wallet with card slots.', price: 950, stock: 30, category: 'Fashion' },
  { title: 'Canvas Sneakers', description: 'Lightweight canvas sneakers for everyday wear.', price: 1400, stock: 45, category: 'Fashion' },
  { title: 'Analog Wrist Watch', description: 'Minimalist analog watch with leather strap.', price: 1750, stock: 20, category: 'Fashion' },
  { title: 'Clean Code', description: 'A handbook of agile software craftsmanship.', price: 650, stock: 25, category: 'Books' },
  { title: 'Atomic Habits', description: 'An easy and proven way to build good habits.', price: 480, stock: 40, category: 'Books' },
  { title: 'The Pragmatic Programmer', description: 'Classic guide for software developers.', price: 720, stock: 18, category: 'Books' },
  { title: 'Deep Work', description: 'Rules for focused success in a distracted world.', price: 420, stock: 30, category: 'Books' },
  { title: 'Data Structures & Algorithms', description: 'A practical guide for interview preparation.', price: 590, stock: 22, category: 'Books' },
  { title: 'Non-Stick Frying Pan', description: '28cm non-stick frying pan with heat-resistant handle.', price: 990, stock: 28, category: 'Home & Kitchen' },
  { title: 'Electric Kettle', description: '1.7L stainless steel electric kettle, auto shut-off.', price: 1350, stock: 24, category: 'Home & Kitchen' },
  { title: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with 3 brightness modes.', price: 780, stock: 32, category: 'Home & Kitchen' },
  { title: 'Yoga Mat', description: 'Non-slip 6mm yoga mat with carry strap.', price: 690, stock: 38, category: 'Sports & Outdoors' },
  { title: 'Adjustable Dumbbell Set', description: '2x10kg adjustable dumbbells for home workouts.', price: 3500, stock: 12, category: 'Sports & Outdoors' },
];

async function main() {
  const adminEmail = 'admin@scic.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('✅ Admin user created -> email: admin@scic.com | password: Admin123!');
  } else {
    console.log('ℹ️  Admin user already exists, skipping seed.');
  }

  const categoryIdByName: Record<string, string> = {};

  for (const cat of categorySeed) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryIdByName[cat.name] = category.id;
  }
  console.log(`✅ ${categorySeed.length} categories ready`);

  let createdCount = 0;
  for (const p of productSeed) {
    const existingProduct = await prisma.product.findFirst({ where: { title: p.title } });
    if (existingProduct) continue;

    await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: categoryIdByName[p.category],
      },
    });
    createdCount++;
  }
  console.log(`✅ ${createdCount} new products created (${productSeed.length - createdCount} already existed)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });