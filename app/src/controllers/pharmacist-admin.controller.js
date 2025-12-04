import * as prescriptionService from '../services/prescription.service.js';

export async function searchPrescriptions(req, res) {
  try {
    const filters = {
      patient: req.query.patient,
      status: req.query.status,
      pharmacist: req.query.pharmacist,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy,
      order: req.query.order,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    const prescriptions = await prescriptionService.searchPrescriptions(filters);
    res.json({ success: true, data: prescriptions, count: prescriptions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching prescriptions', error: error.message });
  }
}

export async function getPrescriptionDetails(req, res) {
  try {
    const prescription = await prescriptionService.getPrescriptionDetails(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching prescription details', error: error.message });
  }
}