import { HttpException } from 'exceptions';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'responses';
import { z } from 'zod';

export function handleError(
  err: unknown,
  req: Request,
  res: Response<ApiResponse & { success: boolean }>,
  next: NextFunction
) {
  if (err instanceof z.ZodError)
    return res.status(400).json({
      success: true,
      errors: err.issues.map((i) => {
        const path = i.path.join('.');
        return `${path} - ${i.message}`;
      }),
    });

  if (err instanceof HttpException)
    return res.status(err.status).json({
      success: false,
      error: err.message,
    });

  if (err instanceof Error)
    return res.status(400).json({
      success: false,
      error: err.message,
    });

  res.status(500).json({
    success: false,
    error: 'Unexpected error occurred',
  });
}
