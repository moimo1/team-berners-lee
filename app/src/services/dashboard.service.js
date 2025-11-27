import * as Dashboard from "../models/dashboard.model.js";

export async function getDashboardData() {
  const stats = await Dashboard.getStats();
  const pharmacists = await Dashboard.getPharmacists();
  const recentPrescriptions = await Dashboard.getRecentPrescriptions();

  return {
    stats,
    pharmacists,
    recentPrescriptions
  };
}
