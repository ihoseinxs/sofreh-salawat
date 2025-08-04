# 🚀 راهنمای Deployment - سفره صلوات

## 📋 پیش‌نیازها

### Backend
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- PM2 (برای production)

### Frontend
- Node.js 18+
- Vite (برای build)

---

## 🛠️ نصب و راه‌اندازی

### 1. کلون کردن پروژه
```bash
git clone <repository-url>
cd sofreh-salawat
```

### 2. نصب Dependencies
```bash
# نصب تمام dependencies
npm run install:all
```

### 3. تنظیم متغیرهای محیطی
```bash
# کپی کردن فایل نمونه
cp .env.example .env

# ویرایش فایل .env
nano .env
```

### 4. راه‌اندازی دیتابیس
```bash
# ایجاد دیتابیس PostgreSQL
createdb sofreh_salawat

# اجرای migrations
cd backend
npm run db:migrate
npm run db:generate
```

### 5. راه‌اندازی Redis
```bash
# در Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# در macOS
brew install redis
brew services start redis
```

---

## 🏃‍♂️ اجرا در محیط Development

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

### هر دو همزمان
```bash
# از پوشه اصلی پروژه
npm run dev
```

---

## 🚀 Deployment در Production

### 1. Backend Deployment

#### با استفاده از PM2
```bash
# نصب PM2
npm install -g pm2

# Build کردن پروژه
cd backend
npm run build

# اجرا با PM2
pm2 start dist/index.js --name "sofreh-salawat-backend"

# تنظیم auto-restart
pm2 startup
pm2 save
```

#### با استفاده از Docker
```bash
# ساخت image
docker build -t sofreh-salawat-backend ./backend

# اجرای container
docker run -d \
  --name sofreh-salawat-backend \
  -p 5000:5000 \
  --env-file .env \
  sofreh-salawat-backend
```

### 2. Frontend Deployment

#### با استفاده از Vercel
```bash
# نصب Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### با استفاده از Netlify
```bash
# Build
cd frontend
npm run build

# آپلود پوشه dist به Netlify
```

#### با استفاده از Nginx
```bash
# Build
cd frontend
npm run build

# کپی کردن فایل‌ها
sudo cp -r dist/* /var/www/sofreh-salawat/

# تنظیم Nginx
sudo nano /etc/nginx/sites-available/sofreh-salawat
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sofreh-salawat;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 تنظیمات Production

### 1. متغیرهای محیطی Production
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/sofreh_salawat"
REDIS_URL="redis://host:6379"
JWT_SECRET="your-super-secure-jwt-secret"
FRONTEND_URL="https://your-domain.com"
```

### 2. SSL/HTTPS
```bash
# با استفاده از Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. Database Backup
```bash
# ایجاد cron job برای backup
0 2 * * * pg_dump sofreh_salawat > /backups/sofreh_salawat_$(date +\%Y\%m\%d).sql
```

---

## 📊 Monitoring

### 1. PM2 Monitoring
```bash
# مشاهده وضعیت
pm2 status
pm2 logs sofreh-salawat-backend

# Monitoring dashboard
pm2 monit
```

### 2. Database Monitoring
```bash
# Prisma Studio
cd backend
npm run db:studio
```

### 3. Redis Monitoring
```bash
# Redis CLI
redis-cli
> info
> monitor
```

---

## 🔒 Security

### 1. Firewall
```bash
# Ubuntu/Debian
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Rate Limiting
```bash
# تنظیم در .env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. CORS
```bash
# تنظیم در backend
FRONTEND_URL="https://your-domain.com"
```

---

## 🐛 Troubleshooting

### مشکلات رایج

#### 1. خطای اتصال به دیتابیس
```bash
# بررسی وضعیت PostgreSQL
sudo systemctl status postgresql

# بررسی اتصال
psql -h localhost -U username -d sofreh_salawat
```

#### 2. خطای Redis
```bash
# بررسی وضعیت Redis
sudo systemctl status redis-server

# تست اتصال
redis-cli ping
```

#### 3. خطای Port
```bash
# بررسی پورت‌های استفاده شده
sudo netstat -tulpn | grep :5000
sudo lsof -i :5000
```

---

## 📈 Performance Optimization

### 1. Database
```sql
-- ایجاد indexes
CREATE INDEX idx_prayers_status ON prayers(status);
CREATE INDEX idx_participations_user_date ON participations(user_id, date);
```

### 2. Redis Caching
```javascript
// کش کردن نتایج پرکاربرد
const cachedPrayers = await redis.get('prayers:active');
if (cachedPrayers) {
  return JSON.parse(cachedPrayers);
}
```

### 3. Frontend Optimization
```bash
# Build optimization
npm run build

# Gzip compression در Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 🔄 CI/CD

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          # deployment scripts
```

---

## 📞 Support

برای پشتیبانی و گزارش مشکلات:
- GitHub Issues
- Email: support@sofrehsalawat.ir
- Telegram: @sofrehsalawat_support 