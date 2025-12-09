import { getDashboardData } from '../services/dashboard.service.js';

export async function getDashboard(req, res) {
  try {
    const data = await getDashboardData();
    // Wraps the result in a standard API response structure
    res.json({ success: true, data });
  } catch (error) {
    console.error('getDashboard error', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
  }
}

export default { getDashboard };