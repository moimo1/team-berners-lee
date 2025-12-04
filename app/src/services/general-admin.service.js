import * as generalAdminModel from '../models/general-admin.model.js';

export async function getDashboard() {
  return await generalAdminModel.getDashboard();
}

export async function getPharmacistAdmins() {
  return await generalAdminModel.getPharmacistAdmins();
}

export async function getAdminPerformance(adminId) {
  return await generalAdminModel.getAdminPerformance(adminId);
}

export async function getAdminTeam(adminId) {
  return await generalAdminModel.getAdminTeam(adminId);
}