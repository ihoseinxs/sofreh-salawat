const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUser() {
  console.log('🔍 جستجوی کاربر حسین...');
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@yahoo.com' }
    });
    
    if (user) {
      console.log('✅ کاربر حسین پیدا شد:');
      console.log('نام:', user.name);
      console.log('ایمیل:', user.email);
      console.log('نقش:', user.role);
      console.log('وضعیت:', user.isActive ? 'فعال' : 'غیرفعال');
      console.log('تاریخ ایجاد:', user.createdAt);
    } else {
      console.log('❌ کاربر حسین پیدا نشد');
      
      // بیایید همه کاربران را ببینیم
      const allUsers = await prisma.user.findMany();
      console.log('📋 همه کاربران موجود:');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email})`);
      });
    }
  } catch (error) {
    console.error('❌ خطا:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUser(); 