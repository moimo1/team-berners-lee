import * as prescriptionModel from '../models/prescription.model.js';

export async function searchPrescriptions(filters) {
  return prescriptionModel.searchPrescriptions(filters);
}

export async function getPrescriptionDetails(id) {
  return prescriptionModel.getPrescriptionById(id);
}