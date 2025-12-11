/**
 * Model: DashboardStats data structure
 * Simple function that creates a dashboard stats object
 */
export function createDashboardStats(data) {
  // Return a plain object (data structure)
  return {
    completed: data.completed || 0,
    pending: data.pending || 0,
    escalations: data.escalations || 0
  };
}

