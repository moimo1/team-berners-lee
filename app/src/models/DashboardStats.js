
export function createDashboardStats(data) {
  return {
    completed: data.completed || 0,
    pending: data.pending || 0,
    escalations: data.escalations || 0
  };
}

