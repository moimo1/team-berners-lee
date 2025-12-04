import express from 'express';
import * as generalAdminController from '../controllers/general-admin.controller.js';

const router = express.Router();

router.get('/dashboard', generalAdminController.getDashboard);
router.get('/admins', generalAdminController.getPharmacistAdmins);
router.get('/admins/:adminId/performance', generalAdminController.getAdminPerformance);
router.get('/admins/:adminId/team', generalAdminController.getAdminTeam);

export default router;