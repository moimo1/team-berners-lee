import { getStats, getPharmacists, getRecentPrescriptions } from '../models/dashboard.model.js';

export async function getDashboardData() {
  // Run all database queries in parallel for speed
  const [statsRows, pharmacists, recent] = await Promise.all([
    getStats(),
    getPharmacists(),
    getRecentPrescriptions()
  ]);

  // Normalize stats into keyed object
  const stats = {
    completed: 0,
    pending: 0,
    escalations: 0,
  };

  // Map the SQL rows to the stats object
  statsRows.forEach((row) => {
    if (row.status === 'completed') stats.completed = row.count;
    if (row.status === 'pending') stats.pending = row.count;
    if (row.status === 'escalations') stats.escalations = row.count;
  });

  return { stats, pharmacists, recentPrescriptions: recent };
}

export default { getDashboardData };