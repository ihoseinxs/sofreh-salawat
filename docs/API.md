# 📚 API Documentation - سفره صلوات

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
تمام درخواست‌های محافظت شده نیاز به توکن JWT دارند که باید در header `Authorization` ارسال شود:
```
Authorization: Bearer <your-jwt-token>
```

---

## 👤 Authentication Endpoints

### ثبت‌نام کاربر جدید
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "نام کاربر",
  "email": "user@example.com",
  "password": "password123",
  "phone": "09123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت ثبت‌نام شد",
  "data": {
    "user": {
      "id": "user_id",
      "name": "نام کاربر",
      "email": "user@example.com",
      "phone": "09123456789"
    },
    "token": "jwt_token_here"
  }
}
```

### ورود کاربر
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### دریافت پروفایل کاربر
```http
GET /auth/profile
```
*نیاز به احراز هویت*

### بروزرسانی پروفایل
```http
PUT /auth/profile
```
*نیاز به احراز هویت*

---

## 🙏 Prayer Endpoints

### ایجاد ختم صلوات جدید
```http
POST /prayers
```
*نیاز به احراز هویت*

**Request Body:**
```json
{
  "title": "ختم صلوات برای سلامتی",
  "description": "توضیحات ختم",
  "intention": "نیت ختم برای سلامتی خانواده",
  "targetCount": 1000,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "isPublic": true
}
```

### دریافت لیست ختم‌ها
```http
GET /prayers?status=ACTIVE&page=1&limit=10
```

**Query Parameters:**
- `status`: وضعیت ختم (ACTIVE, COMPLETED, PAUSED, CANCELLED)
- `page`: شماره صفحه
- `limit`: تعداد آیتم در هر صفحه

### دریافت جزئیات ختم
```http
GET /prayers/{id}
```

### بروزرسانی ختم
```http
PUT /prayers/{id}
```
*نیاز به احراز هویت - فقط سازنده ختم*

### حذف ختم
```http
DELETE /prayers/{id}
```
*نیاز به احراز هویت - فقط سازنده ختم*

### مشارکت در ختم
```http
POST /prayers/{id}/participate
```
*نیاز به احراز هویت*

**Request Body:**
```json
{
  "count": 10
}
```

### دریافت آمار ختم
```http
GET /prayers/{id}/stats
```

---

## 👥 User Endpoints

### دریافت آمار کاربر
```http
GET /users/stats
```
*نیاز به احراز هویت*

### دریافت مشارکت‌های کاربر
```http
GET /users/participations?page=1&limit=10
```
*نیاز به احراز هویت*

---

## 📖 Content Endpoints

### دریافت محتوای مذهبی
```http
GET /content?type=DUA&page=1&limit=10
```

**Query Parameters:**
- `type`: نوع محتوا (DUA, HADITH, SALAWAT_TEXT, SALAWAT_AUDIO, ETIQUETTE)
- `page`: شماره صفحه
- `limit`: تعداد آیتم در هر صفحه

### دریافت محتوا بر اساس نوع
```http
GET /content/{type}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "پیام موفقیت",
  "data": {
    // داده‌های پاسخ
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "پیام خطا",
  "stack": "جزئیات خطا (فقط در محیط توسعه)"
}
```

---

## 🔢 Status Codes

- `200`: موفقیت
- `201`: ایجاد شده
- `400`: خطای درخواست
- `401`: عدم احراز هویت
- `403`: عدم دسترسی
- `404`: یافت نشد
- `500`: خطای سرور

---

## 📝 Notes

1. تمام تاریخ‌ها در فرمت ISO 8601 ارسال می‌شوند
2. تمام متن‌ها به زبان فارسی هستند
3. پشتیبانی کامل از RTL
4. Rate limiting: 100 درخواست در 15 دقیقه
5. فایل‌های آپلود شده حداکثر 5MB

---

## 🧪 Testing

برای تست API می‌توانید از Swagger UI استفاده کنید:
```
http://localhost:5000/api-docs
``` 