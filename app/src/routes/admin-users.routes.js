import express from 'express';
import * as userController from '../controllers/user-management.controller.js';

const router = express.Router();

// doctor
router.get('/doctors', userController.getDoctors);
router.get('/doctors/:id', userController.getDoctor);
router.put('/doctors/:id', userController.updateDoctor);

// patient
router.get('/patients', userController.getPatients);
router.get('/patients/:id', userController.getPatient);
router.put('/patients/:id', userController.updatePatient);

// pharmacist
router.get('/pharmacists', userController.getPharmacists);
router.get('/pharmacists/:id', userController.getPharmacist);
router.put('/pharmacists/:id', userController.updatePharmacist);

export default router;
