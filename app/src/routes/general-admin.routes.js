import express from 'express';
import * as generalAdminController from '../controllers/general-admin.controller.js';

const router = express.Router();

router.get('/admins', generalAdminController.getPharmacistAdmins);
router.get('/admins/:adminId/performance', generalAdminController.getAdminPerformance);

export default router;