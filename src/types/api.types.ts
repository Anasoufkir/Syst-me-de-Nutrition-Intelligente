import type { NutritionReport } from './nutrition.types';

export interface ApiSuccess<T> {
  status: 'success';
  data: T;
  disclaimer: string;
}

export interface ApiError {
  status: 'error';
  code: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export type NutritionAnalysisResponse = ApiSuccess<NutritionReport>;

export const DISCLAIMER =
  "Ces recommandations sont à titre informatif et ne remplacent pas un avis médical, diététique ou nutritionnel professionnel.";
