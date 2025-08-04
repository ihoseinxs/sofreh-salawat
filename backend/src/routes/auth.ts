import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: ثبت‌نام کاربر جدید
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام کاربر
 *               email:
 *                 type: string
 *                 format: email
 *                 description: ایمیل کاربر
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: رمز عبور
 *               phone:
 *                 type: string
 *                 description: شماره تلفن (اختیاری)
 *     responses:
 *       201:
 *         description: کاربر با موفقیت ثبت‌نام شد
 *       400:
 *         description: خطا در اطلاعات ورودی
 */
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('نام باید حداقل 2 کاراکتر باشد'),
  body('email').isEmail().normalizeEmail().withMessage('ایمیل معتبر وارد کنید'),
  body('password').isLength({ min: 6 }).withMessage('رمز عبور باید حداقل 6 کاراکتر باشد'),
  body('phone').optional().isMobilePhone('fa-IR').withMessage('شماره تلفن معتبر وارد کنید'),
  validateRequest
], register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: ورود کاربر
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: ورود موفقیت‌آمیز
 *       401:
 *         description: اطلاعات ورود نادرست
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('ایمیل معتبر وارد کنید'),
  body('password').notEmpty().withMessage('رمز عبور الزامی است'),
  validateRequest
], login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: دریافت اطلاعات پروفایل کاربر
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات پروفایل
 *       401:
 *         description: عدم احراز هویت
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: بروزرسانی پروفایل کاربر
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: پروفایل با موفقیت بروزرسانی شد
 */
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('نام باید حداقل 2 کاراکتر باشد'),
  body('phone').optional().isMobilePhone('fa-IR').withMessage('شماره تلفن معتبر وارد کنید'),
  validateRequest
], updateProfile);

export default router; 