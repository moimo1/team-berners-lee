import { getPrescriptionList } from '../services/prescriptions.service.js';

export async function getPrescriptions(req, res) {
  try {
    const data = await getPrescriptionList(req.query);
    
    res.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    console.error('getPrescriptions error', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve prescriptions' 
    });
  }
}

export default { getPrescriptions };