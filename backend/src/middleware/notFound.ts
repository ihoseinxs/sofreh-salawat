import { Request, Response, NextFunction } from 'express';
 
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`مسیر یافت نشد - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  next(error);
}; 