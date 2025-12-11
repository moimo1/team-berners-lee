import { getDashboardData } from '../services/dashboard.service.js';

/**
 * Controller: HTTP request/response handling for dashboard
 * Handles incoming HTTP requests and sends responses
 */

// Handle GET /dashboard request
export async function getDashboard(req, res) {
  try {
    // Step 1: Get data from service layer (which handles business logic)
    const data = await getDashboardData(req.query);

    // Step 2: Format the response for the client
    // Models are already plain objects, so we can use them directly
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

    // Step 3: Send success response
    res.json({ success: true, data: response });
  } catch (error) {
    // Step 4: Handle errors
    console.error('getDashboard error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
}