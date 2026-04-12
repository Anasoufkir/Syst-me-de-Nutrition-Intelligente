import { Router } from 'express';
import { validate, analyze } from '../controllers/nutrition.controller';

const router = Router();

router.post('/validate', validate);
router.post('/analyze', analyze);

export default router;
