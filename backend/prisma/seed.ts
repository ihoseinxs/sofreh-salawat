import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 شروع seeding دیتابیس...');

  // ایجاد کاربر تست
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'کاربر تست',
      phone: '09123456789',
      role: 'USER',
      isActive: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'مدیر سیستم',
      phone: '09987654321',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const husseinUser = await prisma.user.upsert({
    where: { email: 'test@yahoo.com' },
    update: {},
    create: {
      email: 'test@yahoo.com',
      name: 'حسین',
      phone: '09123456789',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('✅ کاربران ایجاد شدند');

  // ایجاد ختم‌های تست
  const prayers = await Promise.all([
    prisma.prayer.upsert({
      where: { id: 'prayer-1' },
      update: {},
      create: {
        id: 'prayer-1',
        title: 'ختم صلوات برای سلامتی امام زمان',
        description: 'ختم صلوات با نیت سلامتی و تعجیل فرج امام زمان (عج)',
        intention: 'سلامتی و تعجیل فرج امام زمان (عج)',
        targetCount: 1000,
        currentCount: 450,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE',
        isPublic: true,
        createdBy: testUser.id,
      },
    }),
    prisma.prayer.upsert({
      where: { id: 'prayer-2' },
      update: {},
      create: {
        id: 'prayer-2',
        title: 'ختم صلوات برای رفع مشکلات',
        description: 'ختم صلوات با نیت رفع مشکلات و گشایش امور',
        intention: 'رفع مشکلات و گشایش امور',
        targetCount: 500,
        currentCount: 320,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        status: 'ACTIVE',
        isPublic: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.prayer.upsert({
      where: { id: 'prayer-3' },
      update: {},
      create: {
        id: 'prayer-3',
        title: 'ختم صلوات برای توفیق در تحصیل',
        description: 'ختم صلوات با نیت توفیق در تحصیل و موفقیت در امتحانات',
        intention: 'توفیق در تحصیل و موفقیت در امتحانات',
        targetCount: 300,
        currentCount: 300,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        status: 'COMPLETED',
        isPublic: true,
        createdBy: testUser.id,
      },
    }),
  ]);

  console.log('✅ ختم‌های صلوات ایجاد شدند');

  // ایجاد مشارکت‌های تست
  await Promise.all([
    prisma.participation.upsert({
      where: { id: 'part-1' },
      update: {},
      create: {
        id: 'part-1',
        userId: testUser.id,
        prayerId: 'prayer-1',
        count: 50,
        date: new Date(),
      },
    }),
    prisma.participation.upsert({
      where: { id: 'part-2' },
      update: {},
      create: {
        id: 'part-2',
        userId: adminUser.id,
        prayerId: 'prayer-1',
        count: 30,
        date: new Date(),
      },
    }),
    prisma.participation.upsert({
      where: { id: 'part-3' },
      update: {},
      create: {
        id: 'part-3',
        userId: testUser.id,
        prayerId: 'prayer-2',
        count: 25,
        date: new Date(),
      },
    }),
  ]);

  console.log('✅ مشارکت‌ها ایجاد شدند');

  // ایجاد محتوای مذهبی
  const religiousContent = await Promise.all([
    prisma.religiousContent.upsert({
      where: { id: 'content-1' },
      update: {},
      create: {
        id: 'content-1',
        title: 'دعای سلامتی امام زمان',
        content: 'اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ وَلِيًّا وَحَافِظًا وَقَائِدًا وَنَاصِرًا وَدَلِيلًا وَعَيْنًا حَتَّى تُسْكِنَهُ أَرْضَكَ طَوْعًا وَتُمَتِّعَهُ فِيهَا طَوِيلًا',
        type: 'DUA',
        isActive: true,
      },
    }),
    prisma.religiousContent.upsert({
      where: { id: 'content-2' },
      update: {},
      create: {
        id: 'content-2',
        title: 'حدیث درباره صلوات',
        content: 'قالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ: مَنْ صَلَّى عَلَيَّ صَلَاةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرَ صَلَوَاتٍ وَحُطَّتْ عَنْهُ عَشْرُ خَطِيئَاتٍ وَرُفِعَتْ لَهُ عَشْرُ دَرَجَاتٍ',
        type: 'HADITH',
        isActive: true,
      },
    }),
    prisma.religiousContent.upsert({
      where: { id: 'content-3' },
      update: {},
      create: {
        id: 'content-3',
        title: 'صلوات شریف',
        content: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
        type: 'SALAWAT_TEXT',
        isActive: true,
      },
    }),
    prisma.religiousContent.upsert({
      where: { id: 'content-4' },
      update: {},
      create: {
        id: 'content-4',
        title: 'آداب خواندن صلوات',
        content: '1. با وضو خواندن صلوات مستحب است\n2. خواندن صلوات در مسجد ثواب بیشتری دارد\n3. خواندن صلوات با صدای بلند مستحب است\n4. خواندن صلوات در جماعت ثواب بیشتری دارد',
        type: 'ETIQUETTE',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ محتوای مذهبی ایجاد شد');

  // ایجاد آمار کاربران
  await Promise.all([
    prisma.userStats.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        totalPrayers: 75,
        totalParticipations: 2,
        completedPrayers: 1,
      },
    }),
    prisma.userStats.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        totalPrayers: 30,
        totalParticipations: 1,
        completedPrayers: 0,
      },
    }),
  ]);

  console.log('✅ آمار کاربران ایجاد شد');

  // ایجاد آمار ختم‌ها
  await Promise.all([
    prisma.prayerStats.upsert({
      where: { prayerId: 'prayer-1' },
      update: {},
      create: {
        prayerId: 'prayer-1',
        totalParticipants: 2,
        averageDailyCount: 40,
        completionRate: 45.0,
      },
    }),
    prisma.prayerStats.upsert({
      where: { prayerId: 'prayer-2' },
      update: {},
      create: {
        prayerId: 'prayer-2',
        totalParticipants: 1,
        averageDailyCount: 25,
        completionRate: 64.0,
      },
    }),
    prisma.prayerStats.upsert({
      where: { prayerId: 'prayer-3' },
      update: {},
      create: {
        prayerId: 'prayer-3',
        totalParticipants: 1,
        averageDailyCount: 50,
        completionRate: 100.0,
      },
    }),
  ]);

  console.log('✅ آمار ختم‌ها ایجاد شد');

  console.log('🎉 Seeding دیتابیس با موفقیت انجام شد!');
}

main()
  .catch((e) => {
    console.error('❌ خطا در seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 