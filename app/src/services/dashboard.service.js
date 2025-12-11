import * as dashboardRepo from '../repositories/dashboard.repository.js';
import { createDashboardStats } from '../models/DashboardStats.js';
import { createPharmacist } from '../models/Pharmacist.js';
import { createPrescription } from '../models/Prescription.js';

/**
 * Service: Business logic layer for dashboard
 * This is where we apply business rules and transform data
 */

// Get dashboard data with business logic applied
export async function getDashboardData() {
  // Step 1: Get raw data from database (repository layer)
  const [total, fulfilled, pharmacistsData, recentData] = await Promise.all([
    dashboardRepo.getTotalPrescriptions(),
    dashboardRepo.getFulfilledPrescriptions(),
    dashboardRepo.getPharmacists(),
    dashboardRepo.getRecentPrescriptions(10)
  ]);

  // Step 2: Apply business logic - calculate pending prescriptions
  // Business rule: pending = total - fulfilled (but can't be negative)
  const pending = Math.max(total - fulfilled, 0);
  const escalations = 0; // Business rule: escalations currently not tracked

  // Step 3: Transform raw data into model objects (data structures)
  const stats = createDashboardStats({
    completed: fulfilled,
    pending: pending,
    escalations: escalations
  });

  // Transform each pharmacist data into a pharmacist model
  const pharmacists = pharmacistsData.map(data => createPharmacist(data));

  // Transform each prescription data into a prescription model
  const recentPrescriptions = recentData.map(data => {
    // Business logic: Determine status based on dispenseId
    const status = data.dispenseId ? 'Fulfilled' : 'Pending';
    
    // Build pharmacist name from first and last name
    const pharmacistName = data.pharmacistFirstName && data.pharmacistLastName
      ? `${data.pharmacistFirstName} ${data.pharmacistLastName}`
      : null;

    return createPrescription({
      ...data,
      status,
      pharmacistName
    });
  });

  // Step 4: Return the organized data
  return {
    stats,
    pharmacists,
    recentPrescriptions
  };
}