import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

// This handles GET requests to /api/pharma-admin/dashboard/
router.get('/', getDashboard);

export default router;