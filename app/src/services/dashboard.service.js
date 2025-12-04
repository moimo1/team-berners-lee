import * as DashboardModel from '../models/dashboard.model.js';

export async function getDashboardData() {
  const stats = await DashboardModel.getStats();
  const pharmacists = await DashboardModel.getPharmacists();
  const recent = await DashboardModel.getRecentPrescriptions();
  return { stats, pharmacists, recent };
}