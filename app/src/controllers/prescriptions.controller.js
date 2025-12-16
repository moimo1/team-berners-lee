import { getPrescriptionList } from '../services/prescriptions.service.js';


export async function getPrescriptions(req, res) {
  try {
    const prescriptions = await getPrescriptionList(req.query);

    const data = prescriptions.map(pr => ({
      prescID: pr.prescID,
      medicineName: pr.medicineName,
      clientName: pr.clientName,
      pharmacistName: pr.pharmacistName,
      pharmacistId: pr.pharmacistId,
      status: pr.status,
      dateGiven: pr.dateGiven,
      amount: pr.remainingAmount,
      dosage: pr.dosage,
      description: pr.description
    }));

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