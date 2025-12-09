import { Router } from 'express';
import { getPrescriptions } from '../controllers/prescriptions.controller.js';

const router = Router();

router.get('/', getPrescriptions);

export default router;