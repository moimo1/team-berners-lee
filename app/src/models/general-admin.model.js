export async function getDashboard() {
  // Query overall system metrics
  // - Total pharmacist admins
  // - Total pharmacists managed
  // - System-wide prescription metrics
  // - Performance trends across all admins
}

export async function getPharmacistAdmins() {
  // Query all pharmacist admins with their team size and metrics
  // Returns: adminId, name, email, teamSize, prescriptionCount, avgCompletionTime
}

export async function getAdminPerformance(adminId) {
  // Get performance metrics for a specific pharmacist admin
  // Returns: adminId, name, teamSize, prescriptionMetrics, teamPerformance, trends
}

export async function getAdminTeam(adminId) {
  // Get all pharmacists managed by a specific pharmacist admin
  // Returns: List of pharmacists with their metrics
}