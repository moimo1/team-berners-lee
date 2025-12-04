import * as dashboardService from '../services/dashboard.service.js';

export async function getDashboard(req, res) {
  try {
    const data = await dashboardService.getDashboardData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard', error: error.message });
  }
}