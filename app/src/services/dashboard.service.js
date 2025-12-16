import * as dashboardRepo from '../repositories/dashboard.repository.js';
import { createDashboardStats } from '../models/DashboardStats.js';
import { createPharmacist } from '../models/Pharmacist.js';
import { createPrescription } from '../models/Prescription.js';

// Get dashboard data with business logic applied
export async function getDashboardData(filters = {}) {
  const [total, fulfilled, pharmacistsData, recentData] = await Promise.all([
    dashboardRepo.getTotalPrescriptions(filters),
    dashboardRepo.getFulfilledPrescriptions(filters),
    dashboardRepo.getPharmacists(filters),
    dashboardRepo.getRecentPrescriptions({ ...filters, limit: 10 })
  ]);

  const pending = Math.max(total - fulfilled, 0);
  const escalations = 0;
  const stats = createDashboardStats({
    completed: fulfilled,
    pending: pending,
    escalations: escalations
  });

  const pharmacists = pharmacistsData.map(data => createPharmacist(data));

  const recentPrescriptions = recentData.map(data => {

    const status = data.dispenseId ? 'Fulfilled' : 'Pending';

    const pharmacistName = data.pharmacistFirstName && data.pharmacistLastName
      ? `${data.pharmacistFirstName} ${data.pharmacistLastName}`
      : null;

    return createPrescription({
      ...data,
      status,
      pharmacistName
    });
  });

  return {
    stats,
    pharmacists,
    recentPrescriptions
  };
}