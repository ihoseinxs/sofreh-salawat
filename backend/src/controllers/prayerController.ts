import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Create new prayer
export const createPrayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { title, description, intention, targetCount, startDate, endDate, isPublic } = req.body;

    const prayer = await prisma.prayer.create({
      data: {
        title,
        description,
        intention,
        targetCount,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPublic: isPublic ?? true,
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create prayer stats
    await prisma.prayerStats.create({
      data: {
        prayerId: prayer.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'ختم صلوات با موفقیت ایجاد شد',
      data: { prayer }
    });
  } catch (error) {
    next(error);
  }
};

// Get all prayers
export const getPrayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isPublic: true };
    if (status) {
      where.status = status;
    }

    const [prayers, total] = await Promise.all([
      prisma.prayer.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          },
          prayerStats: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.prayer.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        prayers,
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

// Get prayer by ID
export const getPrayerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const prayer = await prisma.prayer.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        prayerStats: true,
        participations: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!prayer) {
      throw new AppError('ختم صلوات یافت نشد', 404);
    }

    res.json({
      success: true,
      data: { prayer }
    });
  } catch (error) {
    next(error);
  }
};

// Update prayer
export const updatePrayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const updateData = req.body;

    // Check if user owns the prayer
    const prayer = await prisma.prayer.findUnique({
      where: { id }
    });

    if (!prayer) {
      throw new AppError('ختم صلوات یافت نشد', 404);
    }

    if (prayer.createdBy !== userId) {
      throw new AppError('شما مجاز به ویرایش این ختم نیستید', 403);
    }

    const updatedPrayer = await prisma.prayer.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'ختم صلوات با موفقیت بروزرسانی شد',
      data: { prayer: updatedPrayer }
    });
  } catch (error) {
    next(error);
  }
};

// Delete prayer
export const deletePrayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if user owns the prayer
    const prayer = await prisma.prayer.findUnique({
      where: { id }
    });

    if (!prayer) {
      throw new AppError('ختم صلوات یافت نشد', 404);
    }

    if (prayer.createdBy !== userId) {
      throw new AppError('شما مجاز به حذف این ختم نیستید', 403);
    }

    await prisma.prayer.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'ختم صلوات با موفقیت حذف شد'
    });
  } catch (error) {
    next(error);
  }
};

// Participate in prayer
export const participateInPrayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { count } = req.body;

    // Check if prayer exists
    const prayer = await prisma.prayer.findUnique({
      where: { id }
    });

    if (!prayer) {
      throw new AppError('ختم صلوات یافت نشد', 404);
    }

    if (prayer.status !== 'ACTIVE') {
      throw new AppError('این ختم در حال حاضر فعال نیست', 400);
    }

    // Create or update participation
    const participation = await prisma.participation.upsert({
      where: {
        userId_prayerId_date: {
          userId,
          prayerId: id,
          date: new Date().toISOString().split('T')[0]
        }
      },
      update: {
        count: {
          increment: count
        }
      },
      create: {
        userId,
        prayerId: id,
        count
      }
    });

    // Update prayer current count
    await prisma.prayer.update({
      where: { id },
      data: {
        currentCount: {
          increment: count
        }
      }
    });

    // Update user stats
    await prisma.userStats.update({
      where: { userId },
      data: {
        totalPrayers: {
          increment: count
        }
      }
    });

    res.json({
      success: true,
      message: 'مشارکت شما با موفقیت ثبت شد',
      data: { participation }
    });
  } catch (error) {
    next(error);
  }
};

// Get prayer stats
export const getPrayerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const stats = await prisma.prayerStats.findUnique({
      where: { prayerId: id },
      include: {
        prayer: {
          select: {
            title: true,
            targetCount: true,
            currentCount: true,
            status: true
          }
        }
      }
    });

    if (!stats) {
      throw new AppError('آمار ختم یافت نشد', 404);
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
}; 