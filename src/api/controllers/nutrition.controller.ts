import type { Request, Response } from 'express';
import { validateProfile } from '../../core/validators/profile.validator';
import { analyserNutrition } from '../../core/engine/nutrition.engine';
import type { ApiError, NutritionAnalysisResponse } from '../../types/api.types';
import { DISCLAIMER } from '../../types/api.types';

export function validate(req: Request, res: Response): void {
  const result = validateProfile(req.body);

  if (!result.success) {
    const error: ApiError = {
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Données du profil invalides',
      errors: result.errors,
    };
    res.status(400).json(error);
    return;
  }

  res.status(200).json({ status: 'success', message: 'Profil valide' });
}

export function analyze(req: Request, res: Response): void {
  const result = validateProfile(req.body);

  if (!result.success) {
    const error: ApiError = {
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Données du profil invalides',
      errors: result.errors,
    };
    res.status(400).json(error);
    return;
  }

  const report = analyserNutrition(result.data);

  const response: NutritionAnalysisResponse = {
    status: 'success',
    data: report,
    disclaimer: DISCLAIMER,
  };

  res.status(200).json(response);
}
