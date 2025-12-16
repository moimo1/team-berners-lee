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
      dosage: pr.dosage,
      description: pr.description,
      updatedAt: pr.updatedAt
    }));

    if (data.length > 0) {
      console.log('Sample prescription sent to frontend:', {
        id: data[0].prescID,
        amount: data[0].amount,
        dosage: data[0].dosage,
        pharmaId: data[0].pharmacistId,
        pharmaName: data[0].pharmacistName
      });
    } else {
      console.log('No prescriptions found to send.');
    }

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