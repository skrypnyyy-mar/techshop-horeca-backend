require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Clean up ──────────────────────────────────────────────────────────────
  await prisma.refreshToken.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.horecaSpec.deleteMany();
  await prisma.horecaItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ─────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@techshop.com',
      passwordHash,
      name: 'Admin User',
      phone: '+380501234567',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@techshop.com',
      passwordHash,
      name: 'HoReCa Manager',
      phone: '+380507654321',
      role: 'HORECA_MANAGER',
    },
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@techshop.com',
      passwordHash,
      name: 'John Doe',
      phone: '+380509876543',
      role: 'CLIENT',
    },
  });

  console.log('✅ Users created');

  // ─── Products ──────────────────────────────────────────────────────────────
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 15 Pro',
        tagline: 'Titanium. So strong. So light. So Pro.',
        description: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and a customizable Action button.',
        price: 45999,
        category: 'PHONES',
        imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800',
        rating: 4.9,
        reviewsCount: 1250,
        colors: ['Black', 'White', 'Blue', 'Natural'],
        inStock: true,
        stockCount: 50,
        brand: 'Apple',
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        tagline: 'The ultimate AI smartphone experience.',
        description: 'Galaxy S24 Ultra with Galaxy AI, S Pen, and 200MP camera.',
        price: 42999,
        category: 'PHONES',
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        rating: 4.8,
        reviewsCount: 980,
        colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
        inStock: true,
        stockCount: 35,
        brand: 'Samsung',
      },
      {
        name: 'MacBook Pro 16" M3',
        tagline: 'Mind-blowing. Head-turning.',
        description: 'MacBook Pro with M3 chip delivers incredible performance and up to 22 hours of battery life.',
        price: 89999,
        category: 'LAPTOPS',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        rating: 4.9,
        reviewsCount: 750,
        colors: ['Space Black', 'Silver'],
        inStock: true,
        stockCount: 20,
        brand: 'Apple',
      },
      {
        name: 'Sony WH-1000XM5',
        tagline: 'Industry-leading noise canceling headphones.',
        description: 'The WH-1000XM5 headphones with Auto NC Optimizer and Speak-to-Chat technology.',
        price: 12999,
        category: 'AUDIO',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        rating: 4.8,
        reviewsCount: 2100,
        colors: ['Black', 'Silver'],
        inStock: true,
        stockCount: 80,
        brand: 'Sony',
      },
      {
        name: 'Apple Watch Series 9',
        tagline: 'Smarter. Brighter. Mightier.',
        description: 'The Apple Watch Series 9 with the new S9 chip and Double Tap gesture.',
        price: 15999,
        category: 'WEARABLES',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
        rating: 4.7,
        reviewsCount: 890,
        colors: ['Midnight', 'Starlight', 'Pink', 'Red'],
        inStock: true,
        stockCount: 60,
        brand: 'Apple',
      },
      {
        name: 'iPad Pro 12.9" M2',
        tagline: 'The ultimate iPad experience.',
        description: 'iPad Pro with M2 chip, ProMotion display, and Apple Pencil hover.',
        price: 39999,
        category: 'TABLETS',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        rating: 4.8,
        reviewsCount: 640,
        colors: ['Space Gray', 'Silver'],
        inStock: true,
        stockCount: 30,
        brand: 'Apple',
      },
    ],
  });

  console.log('✅ Products created');

  // ─── HoReCa Items ──────────────────────────────────────────────────────────
  const coffeeMachine = await prisma.horecaItem.create({
    data: {
      name: 'La Cimbali M100',
      brand: 'La Cimbali',
      tagline: 'Ідеальна кава для вашого бізнесу',
      description: 'Професійна еспресо-машина La Cimbali M100 з сенсорним дисплеєм і системою автоматичного очищення.',
      pricePerDay: 1500,
      priceBuy: 185000,
      category: 'COFFEE_MACHINES',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      power: '6800 Вт',
      dimensions: '790 × 580 × 580 мм',
      warranty: '2 роки',
      inStock: true,
      specs: {
        create: [
          { label: 'Тиск', value: '9 бар' },
          { label: 'Ємність бойлера', value: '14 л' },
          { label: 'Груп', value: '2' },
          { label: 'Вага', value: '95 кг' },
        ],
      },
    },
  });

  const oven = await prisma.horecaItem.create({
    data: {
      name: 'Rational SCC 101',
      brand: 'Rational',
      tagline: 'Готуйте більше з меншими зусиллями',
      description: 'Комбінована пароконвектомат Rational SCC 101 для приготування будь-яких страв.',
      pricePerDay: 2200,
      priceBuy: 320000,
      category: 'OVENS',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      power: '21 кВт',
      dimensions: '847 × 771 × 794 мм',
      warranty: '2 роки',
      inStock: true,
      specs: {
        create: [
          { label: 'Ємність', value: '10 рівнів GN 1/1' },
          { label: 'Температура', value: '30-300°C' },
          { label: 'Режими', value: 'Пара, Конвекція, Комбі' },
          { label: 'Вага', value: '120 кг' },
        ],
      },
    },
  });

  const fridge = await prisma.horecaItem.create({
    data: {
      name: 'True TWT-27F',
      brand: 'True',
      tagline: 'Надійне холодильне обладнання',
      description: 'Комерційний холодильник True з нержавіючої сталі та системою примусової конвекції.',
      pricePerDay: 800,
      priceBuy: 95000,
      category: 'REFRIGERATION',
      imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800',
      power: '750 Вт',
      dimensions: '813 × 762 × 838 мм',
      warranty: '3 роки',
      inStock: true,
      specs: {
        create: [
          { label: "Об'єм", value: '765 л' },
          { label: 'Температура', value: '-23 до -18°C' },
          { label: 'Двері', value: '3' },
          { label: 'Клас енергоефективності', value: 'A+' },
        ],
      },
    },
  });

  const mixer = await prisma.horecaItem.create({
    data: {
      name: 'Hobart HL600',
      brand: 'Hobart',
      tagline: 'Потужний планетарний міксер',
      description: 'Планетарний міксер Hobart HL600 для інтенсивного використання в ресторанах та пекарнях.',
      pricePerDay: 600,
      priceBuy: 68000,
      category: 'MIXERS',
      imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800',
      power: '2200 Вт',
      dimensions: '520 × 430 × 830 мм',
      warranty: '2 роки',
      inStock: true,
      specs: {
        create: [
          { label: 'Ємність чаші', value: '60 л' },
          { label: 'Швидкості', value: '3' },
          { label: 'Вага', value: '145 кг' },
          { label: 'Насадки', value: 'Гак, Лопатка, Вінчик' },
        ],
      },
    },
  });

  await prisma.horecaItem.create({
    data: {
      name: 'Winterhalter UC-M',
      brand: 'Winterhalter',
      tagline: 'Ідеальна чистота для вашого закладу',
      description: 'Тунельна посудомийна машина Winterhalter UC-M для великих ресторанів.',
      pricePerDay: 1800,
      priceBuy: 240000,
      category: 'DISHWASHERS',
      imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
      power: '18 кВт',
      dimensions: '1200 × 750 × 850 мм',
      warranty: '2 роки',
      inStock: true,
      specs: {
        create: [
          { label: 'Продуктивність', value: '1800 тарілок/год' },
          { label: 'Температура миття', value: '60°C' },
          { label: 'Температура ополіскування', value: '85°C' },
          { label: 'Вага', value: '210 кг' },
        ],
      },
    },
  });

  await prisma.horecaItem.create({
    data: {
      name: 'Electrolux EKG600301K',
      brand: 'Electrolux',
      tagline: 'Надійні плити для profesійної кухні',
      description: 'Газова плита Electrolux на 6 конфорок з духовою шафою для ресторанів.',
      pricePerDay: 700,
      priceBuy: 45000,
      category: 'STOVES',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      power: '24 кВт (газ)',
      dimensions: '1200 × 700 × 850 мм',
      warranty: '2 роки',
      inStock: true,
      specs: {
        create: [
          { label: 'Конфорки', value: '6 газових' },
          { label: 'Духовка', value: 'Газова, 105 л' },
          { label: 'Матеріал', value: 'Нержавіюча сталь' },
          { label: 'Вага', value: '180 кг' },
        ],
      },
    },
  });

  console.log('✅ HoReCa items created');

  // ─── Sample order ──────────────────────────────────────────────────────────
  const allProducts = await prisma.product.findMany({ take: 2 });

  await prisma.order.create({
    data: {
      userId: client.id,
      status: 'CONFIRMED',
      totalAmount: allProducts[0].price,
      deliveryAddress: 'вул. Хрещатик 1, Київ, 01001',
      notes: 'Зателефонувати перед доставкою',
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 1,
            priceAtOrder: allProducts[0].price,
          },
        ],
      },
    },
  });

  console.log('✅ Sample order created');

  // ─── Sample booking ────────────────────────────────────────────────────────
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 3);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  const days = 7;

  await prisma.booking.create({
    data: {
      userId: client.id,
      horecaItemId: coffeeMachine.id,
      bookingType: 'RENT',
      status: 'CONFIRMED',
      startDate,
      endDate,
      totalPrice: coffeeMachine.pricePerDay * days,
      contactName: 'John Doe',
      contactPhone: '+380509876543',
      notes: 'Потрібна доставка та встановлення',
    },
  });

  console.log('✅ Sample booking created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Test accounts:');
  console.log('  Admin:   admin@techshop.com   / password123');
  console.log('  Manager: manager@techshop.com / password123');
  console.log('  Client:  client@techshop.com  / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
