const express = require('express');
const prescriptionController = require('../controllers/prescription.controller');

const router = express.Router();

router.get('/search', prescriptionController.searchPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionDetails);

module.exports = router;