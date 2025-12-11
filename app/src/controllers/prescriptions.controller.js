import { getPrescriptionList } from '../services/prescriptions.service.js';

/**
 * Controller: HTTP request/response handling for prescriptions
 * Handles incoming HTTP requests and sends responses
 */

// Handle GET /prescriptions request
export async function getPrescriptions(req, res) {
  try {
    // Step 1: Get data from service layer (which handles business logic)
    // req.query contains the URL query parameters (like ?search=something&status=Pending)
    const prescriptions = await getPrescriptionList(req.query);
    
    // Step 2: Format the response for the client
    // Models are already plain objects, so we can use them directly
    const data = prescriptions.map(pr => ({
      prescID: pr.prescID,
      medicineName: pr.medicineName,
      clientName: pr.clientName,
      pharmacistName: pr.pharmacistName,
      pharmacistId: pr.pharmacistId,
      status: pr.status,
      dateGiven: pr.dateGiven
    }));
    
    // Step 3: Send success response
    res.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    // Step 4: Handle errors
    console.error('getPrescriptions error', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve prescriptions' 
    });
  }
}