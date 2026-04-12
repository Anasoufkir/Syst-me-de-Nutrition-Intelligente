import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '../../types/api.types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const body: ApiError = {
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Une erreur interne est survenue',
  };
  res.status(500).json(body);
}
