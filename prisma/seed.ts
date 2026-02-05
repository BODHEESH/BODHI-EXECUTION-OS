import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'ME',
    },
  });

  console.log('Created user:', user);

  // Create sample daily trackers
  const dailyTrackers = [
    {
      date: new Date('2024-02-05'),
      day: 'Monday',
      deepWorkDone: true,
      gymDone: true,
      contentDone: false,
      ecommerceDone: true,
      printerDone: false,
      sleepBefore11: true,
      wake530: true,
      mood: 'GREAT',
      notes: 'Productive day!',
      score: 6,
      userId: user.id,
    },
    {
      date: new Date('2024-02-04'),
      day: 'Sunday',
      deepWorkDone: false,
      gymDone: true,
      contentDone: true,
      ecommerceDone: false,
      printerDone: true,
      sleepBefore11: false,
      wake530: false,
      mood: 'GOOD',
      notes: 'Relaxed weekend',
      score: 4,
      userId: user.id,
    },
  ];

  for (const tracker of dailyTrackers) {
    await prisma.dailyTracker.upsert({
      where: { userId_date: { userId: user.id, date: tracker.date } },
      update: tracker,
      create: tracker,
    });
  }

  console.log('Created daily trackers');

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete Next.js tutorial video',
      description: 'Finish recording and editing the tutorial',
      category: 'YOUTUBE',
      priority: 'HIGH',
      status: 'TODAY',
      dueDate: '2024-02-08',
      estimatedTime: 'HOUR2',
      owner: 'ME',
      userId: user.id,
    },
    {
      title: 'Design new t-shirt graphics',
      description: 'Create designs for the summer collection',
      category: 'ECOMMERCE',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: '2024-02-10',
      estimatedTime: 'HOUR4',
      owner: 'WIFE',
      userId: user.id,
    },
    {
      title: '3D print customer order',
      description: 'Print and prepare the custom figurine',
      category: 'PRINTER',
      priority: 'HIGH',
      status: 'TODAY',
      dueDate: '2024-02-08',
      estimatedTime: 'HOUR2',
      owner: 'ME',
      userId: user.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('Created tasks');

  // Create sample content
  const content = [
    {
      title: 'Next.js 14 App Router Tutorial',
      platforms: 'BODHI_TECH_TALKS,SHORTS',
      type: 'LONG_VIDEO',
      status: 'EDITING',
      shootDate: '2024-02-06',
      publishDate: '2024-02-10',
      owner: 'ME',
      remarks: 'Need to add thumbnail',
      userId: user.id,
    },
    {
      title: 'Prisma Performance Tips',
      platforms: 'BODHI_LEARN',
      type: 'SHORT',
      status: 'SCRIPTED',
      shootDate: '2024-02-08',
      publishDate: '2024-02-12',
      owner: 'WIFE',
      remarks: 'Research complete',
      userId: user.id,
    },
  ];

  for (const item of content) {
    await prisma.content.create({
      data: item,
    });
  }

  console.log('Created content');

  // Create sample business orders
  const business = [
    {
      customerName: 'John Doe',
      businessType: 'CLOTHING',
      orderStatus: 'DELIVERED',
      orderDate: new Date('2024-02-01'),
      deliveryDate: new Date('2024-02-05'),
      amount: 2500,
      cost: 1200,
      profit: 1300,
      paymentStatus: 'PAID',
      handledBy: 'ME',
      notes: 'Custom t-shirt order',
      userId: user.id,
    },
    {
      customerName: 'Jane Smith',
      businessType: 'PRINTING_3D',
      orderStatus: 'PRINTING',
      orderDate: new Date('2024-02-08'),
      amount: 800,
      cost: 200,
      profit: 600,
      paymentStatus: 'PENDING',
      handledBy: 'WIFE',
      notes: 'Custom figurine design',
      userId: user.id,
    },
    {
      customerName: 'Bob Johnson',
      businessType: 'CLOTHING',
      orderStatus: 'NEW',
      orderDate: new Date('2024-02-10'),
      amount: 1500,
      cost: 600,
      profit: 900,
      paymentStatus: 'PAID',
      handledBy: 'ME',
      notes: 'Hoodie bulk order',
      userId: user.id,
    },
  ];

  for (const order of business) {
    await prisma.business.create({
      data: order,
    });
  }

  console.log('Created business orders');

  console.log('Seeding finished.');
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
