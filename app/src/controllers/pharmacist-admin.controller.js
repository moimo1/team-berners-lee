import * as pharmacistAdminService from '../services/pharmacist-admin.service.js';

export async function getDashboard(req, res) {
  try {
    const dashboard = await pharmacistAdminService.getDashboard();
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard', error: error.message });
  }
}

export async function getPharmacists(req, res) {
  try {
    const pharmacists = await pharmacistAdminService.getPharmacists();
    res.json({ success: true, data: pharmacists, count: pharmacists.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pharmacists', error: error.message });
  }
}

export async function getPharmacistPerformance(req, res) {
  try {
    const performance = await pharmacistAdminService.getPharmacistPerformance(req.params.pharmacistId);
    if (!performance) return res.status(404).json({ success: false, message: 'Pharmacist not found' });
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pharmacist performance', error: error.message });
  }
}

export async function getPrescriptions(req, res) {
  try {
    const prescriptions = await pharmacistAdminService.getPrescriptions(req.query);
    res.json({ success: true, data: prescriptions, count: prescriptions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching prescriptions', error: error.message });
  }
}

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