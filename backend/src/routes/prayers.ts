import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createPrayer, 
  getPrayers, 
  getPrayerById, 
  updatePrayer, 
  deletePrayer,
  participateInPrayer,
  getPrayerStats
} from '../controllers/prayerController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();

/**
 * @swagger
 * /api/prayers:
 *   post:
 *     summary: ایجاد ختم صلوات جدید
 *     tags: [Prayers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - intention
 *               - targetCount
 *               - startDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: عنوان ختم
 *               description:
 *                 type: string
 *                 description: توضیحات (اختیاری)
 *               intention:
 *                 type: string
 *                 description: نیت ختم
 *               targetCount:
 *                 type: integer
 *                 minimum: 1
 *                 description: تعداد هدف صلوات
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ شروع
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ پایان (اختیاری)
 *               isPublic:
 *                 type: boolean
 *                 default: true
 *                 description: عمومی یا خصوصی
 */
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 3 }).withMessage('عنوان باید حداقل 3 کاراکتر باشد'),
  body('intention').trim().isLength({ min: 5 }).withMessage('نیت باید حداقل 5 کاراکتر باشد'),
  body('targetCount').isInt({ min: 1 }).withMessage('تعداد هدف باید عدد مثبت باشد'),
  body('startDate').isISO8601().withMessage('تاریخ شروع معتبر نیست'),
  body('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست'),
  body('isPublic').optional().isBoolean().withMessage('مقدار عمومی باید true یا false باشد'),
  validateRequest
], createPrayer);

/**
 * @swagger
 * /api/prayers:
 *   get:
 *     summary: دریافت لیست ختم‌های صلوات
 *     tags: [Prayers]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, PAUSED, CANCELLED]
 *         description: فیلتر بر اساس وضعیت
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: تعداد آیتم در هر صفحه
 */
router.get('/', getPrayers);

/**
 * @swagger
 * /api/prayers/{id}:
 *   get:
 *     summary: دریافت جزئیات ختم صلوات
 *     tags: [Prayers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه ختم
 */
router.get('/:id', getPrayerById);

/**
 * @swagger
 * /api/prayers/{id}:
 *   put:
 *     summary: بروزرسانی ختم صلوات
 *     tags: [Prayers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', authenticate, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('عنوان باید حداقل 3 کاراکتر باشد'),
  body('intention').optional().trim().isLength({ min: 5 }).withMessage('نیت باید حداقل 5 کاراکتر باشد'),
  body('targetCount').optional().isInt({ min: 1 }).withMessage('تعداد هدف باید عدد مثبت باشد'),
  body('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست'),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED']).withMessage('وضعیت نامعتبر است'),
  validateRequest
], updatePrayer);

/**
 * @swagger
 * /api/prayers/{id}:
 *   delete:
 *     summary: حذف ختم صلوات
 *     tags: [Prayers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', authenticate, deletePrayer);

/**
 * @swagger
 * /api/prayers/{id}/participate:
 *   post:
 *     summary: مشارکت در ختم صلوات
 *     tags: [Prayers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - count
 *             properties:
 *               count:
 *                 type: integer
 *                 minimum: 1
 *                 description: تعداد صلوات خوانده شده
 */
router.post('/:id/participate', authenticate, [
  body('count').isInt({ min: 1 }).withMessage('تعداد باید عدد مثبت باشد'),
  validateRequest
], participateInPrayer);

/**
 * @swagger
 * /api/prayers/{id}/stats:
 *   get:
 *     summary: دریافت آمار ختم صلوات
 *     tags: [Prayers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id/stats', getPrayerStats);

export default router; 