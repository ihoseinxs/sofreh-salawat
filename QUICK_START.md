# 🚀 راهنمای سریع شروع - سفره صلوات

## ⚡ شروع سریع (5 دقیقه)

### 1. پیش‌نیازها
```bash
# نصب Node.js 18+
# نصب Docker و Docker Compose
# نصب Git
```

### 2. کلون و راه‌اندازی
```bash
# کلون کردن پروژه
git clone <repository-url>
cd sofreh-salawat

# راه‌اندازی با Docker (ساده‌ترین روش)
docker-compose up -d

# یا راه‌اندازی دستی
npm run install:all
cp .env.example .env
# ویرایش فایل .env
npm run dev
```

### 3. دسترسی
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5000
- 📚 API Docs: http://localhost:5000/api-docs
- 🗄️ Database: localhost:5432
- 🔴 Redis: localhost:6379

---

## 🛠️ راه‌اندازی دستی

### Backend
```bash
cd backend
npm install
cp .env.example .env
# تنظیم DATABASE_URL و REDIS_URL در .env
npm run db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 ویژگی‌های کلیدی

### ✅ پیاده‌سازی شده
- [x] احراز هویت JWT
- [x] CRUD ختم‌های صلوات
- [x] مشارکت در ختم‌ها
- [x] آمار و گزارش‌گیری
- [x] API کامل با Swagger
- [x] طراحی ریسپانسیو
- [x] پشتیبانی RTL
- [x] Docker Compose

### 🚧 در حال توسعه
- [ ] PWA (Progressive Web App)
- [ ] نوتیفیکیشن push
- [ ] پخش صوتی صلوات
- [ ] اشتراک‌گذاری اجتماعی
- [ ] داشبورد پیشرفته

---

## 🔧 تنظیمات مهم

### متغیرهای محیطی ضروری
```bash
# Backend (.env)
DATABASE_URL="postgresql://user:pass@localhost:5432/sofreh_salawat"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"

# Frontend (.env)
VITE_API_URL="http://localhost:5000/api"
```

### دیتابیس
```bash
# ایجاد دیتابیس
createdb sofreh_salawat

# اجرای migrations
cd backend
npm run db:migrate
npm run db:generate
```

---

## 🧪 تست API

### با Swagger UI
```
http://localhost:5000/api-docs
```

### با curl
```bash
# ثبت‌نام
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"تست","email":"test@test.com","password":"123456"}'

# ورود
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 📁 ساختار پروژه

```
sofreh-salawat/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # کنترلرهای API
│   │   ├── routes/         # مسیرهای API
│   │   ├── middleware/     # middleware ها
│   │   └── config/         # تنظیمات
│   ├── prisma/             # Schema دیتابیس
│   └── package.json
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # کامپوننت‌ها
│   │   ├── pages/         # صفحات
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── docs/                   # مستندات
├── docker-compose.yml      # Docker setup
└── README.md
```

---

## 🐛 مشکلات رایج

### خطای اتصال به دیتابیس
```bash
# بررسی وضعیت PostgreSQL
sudo systemctl status postgresql

# بررسی اتصال
psql -h localhost -U username -d sofreh_salawat
```

### خطای Redis
```bash
# بررسی وضعیت Redis
sudo systemctl status redis-server

# تست اتصال
redis-cli ping
```

### خطای Port
```bash
# بررسی پورت‌های استفاده شده
sudo lsof -i :5000
sudo lsof -i :3000
```

---

## 📞 پشتیبانی

- 📧 Email: support@sofrehsalawat.ir
- 💬 Telegram: @sofrehsalawat_support
- 🐛 GitHub Issues: [Repository Issues]

---

## 🙏 مشارکت

برای مشارکت در پروژه:
1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات را commit کنید
4. Pull Request ارسال کنید

---

**با نیت خالص و برای رضای خداوند متعال** 🌸 