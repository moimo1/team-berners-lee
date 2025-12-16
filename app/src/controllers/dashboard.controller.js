import { getDashboardData } from '../services/dashboard.service.js';



export async function getDashboard(req, res) {
  try {
    const data = await getDashboardData(req.query);

    const response = {
      stats: {
        completed: data.stats.completed,
        pending: data.stats.pending,
        escalations: data.stats.escalations
      },
      pharmacists: data.pharmacists.map(p => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        location: p.location,
        handled: p.handled
      })),
      recentPrescriptions: data.recentPrescriptions.map(pr => ({
        prescID: pr.prescID,
        medicineName: pr.medicineName,
        clientName: pr.clientName,
        pharmacistName: pr.pharmacistName,
        status: pr.status,
        dateGiven: pr.dateGiven
      }))
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('getDashboard error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
}