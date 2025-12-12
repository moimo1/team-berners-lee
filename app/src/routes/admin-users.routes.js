import express from 'express';
import * as userController from '../controllers/user-management.controller.js';

const router = express.Router();

// doctor
router.get('/doctors', userController.getDoctors);
router.get('/doctors/:id', userController.getDoctor);
router.put('/doctors/:id', userController.updateDoctor);
router.delete('/doctors/:id', userController.deleteDoctor);
router.post('/doctors', userController.createDoctor);

// patient
router.get('/patients', userController.getPatients);
router.get('/patients/:id', userController.getPatient);
router.put('/patients/:id', userController.updatePatient);
router.delete('/patients/:id', userController.deletePatient);
router.post('/patients', userController.createPatient);

// pharmacist
router.get('/pharmacists', userController.getPharmacists);
router.get('/pharmacists/:id', userController.getPharmacist);
router.put('/pharmacists/:id', userController.updatePharmacist);
router.delete('/pharmacists/:id', userController.deletePharmacist);
router.post('/pharmacists', userController.createPharmacist);

export default router;
