import { Router } from 'express';
import { getPharmacistHistory } from '../controllers/pharmacist-history.controller.js';

const router = Router();

// GET /api/pharma-admin/pharmacists/:id/history
router.get('/:id/history', getPharmacistHistory);

export default router;
