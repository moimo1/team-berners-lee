import express from 'express';
import * as pharmacistAdminController from '../controllers/pharmacist-admin.controller.js';

const router = express.Router();

router.get('/dashboard', pharmacistAdminController.getDashboard);
router.get('/pharmacists', pharmacistAdminController.getPharmacists);
router.get('/pharmacists/:pharmacistId/performance', pharmacistAdminController.getPharmacistPerformance);
router.get('/prescriptions', pharmacistAdminController.getPrescriptions);

export default router;