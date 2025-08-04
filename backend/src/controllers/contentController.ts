import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Get religious content
export const getReligiousContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }

    const [content, total] = await Promise.all([
      prisma.religiousContent.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.religiousContent.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        content,
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

// Get content by type
export const getContentByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;

    const content = await prisma.religiousContent.findMany({
      where: {
        type: type as any,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    next(error);
  }
}; 