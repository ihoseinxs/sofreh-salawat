import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Get user stats
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const stats = await prisma.userStats.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!stats) {
      throw new AppError('آمار کاربر یافت نشد', 404);
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// Get user participations
export const getUserParticipations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [participations, total] = await Promise.all([
      prisma.participation.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        include: {
          prayer: {
            select: {
              id: true,
              title: true,
              intention: true,
              targetCount: true,
              currentCount: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.participation.count({ where: { userId } })
    ]);

    res.json({
      success: true,
      data: {
        participations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 