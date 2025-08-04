import { Router } from 'express';
import { getUserStats, getUserParticipations } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: دریافت آمار کاربر
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: آمار کاربر
 */
router.get('/stats', authenticate, getUserStats);

/**
 * @swagger
 * /api/users/participations:
 *   get:
 *     summary: دریافت مشارکت‌های کاربر
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
router.get('/participations', authenticate, getUserParticipations);

export default router; 