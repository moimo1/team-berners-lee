import express from 'express';
import { searchPrescriptions, getPrescriptionDetails } from '../controllers/prescription.controller.js';

const router = express.Router();

router.get('/search', searchPrescriptions);
router.get('/:id', getPrescriptionDetails);

export default router;