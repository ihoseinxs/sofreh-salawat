import { Router } from 'express';
import { getReligiousContent, getContentByType } from '../controllers/contentController';

const router = Router();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: دریافت محتوای مذهبی
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [DUA, HADITH, SALAWAT_TEXT, SALAWAT_AUDIO, ETIQUETTE]
 *         description: نوع محتوا
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
router.get('/', getReligiousContent);

/**
 * @swagger
 * /api/content/{type}:
 *   get:
 *     summary: دریافت محتوای مذهبی بر اساس نوع
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DUA, HADITH, SALAWAT_TEXT, SALAWAT_AUDIO, ETIQUETTE]
 *         description: نوع محتوا
 */
router.get('/:type', getContentByType);

export default router; 