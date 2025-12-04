import * as pharmacistAdminModel from '../models/pharmacist-admin.model.js';

export async function getDashboard() {
  return await pharmacistAdminModel.getDashboard();
}

export async function getPharmacists() {
  return await pharmacistAdminModel.getPharmacists();
}

export async function getPharmacistPerformance(pharmacistId) {
  return await pharmacistAdminModel.getPharmacistPerformance(pharmacistId);
}

export async function getPrescriptions(filters) {
  return await pharmacistAdminModel.getPrescriptions(filters);
}