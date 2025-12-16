import { searchPrescriptions } from '../repositories/prescriptions.repository.js';
import { createPrescription } from '../models/Prescription.js';


export async function getPrescriptionList(query) {
  const filters = {
    pharmacistId: query.pharmacistId || null,
    status: query.status || null,
    from: query.from || null,
    to: query.to || null,
    search: query.search || null
  };

  const rows = await searchPrescriptions(filters);

  const prescriptions = rows.map(row => {
    let status = 'Pending';

    if (row.remainingAmount !== null && row.remainingAmount <= 0) {
      status = 'Fulfilled';
    }
    else if (row.dispenseId) {
      status = 'Collected';
    }

    const pharmacistName = row.pharmacistFirstName && row.pharmacistLastName
      ? `${row.pharmacistFirstName} ${row.pharmacistLastName}`
      : null;

    return createPrescription({
      ...row,
      status,
      pharmacistName
    });
  });

  return prescriptions;
}