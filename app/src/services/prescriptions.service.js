import { searchPrescriptions } from '../models/prescriptions.models.js';

export async function getPrescriptionList(query) {
  const filters = {
    pharmacistId: query.pharmacistId || null,
    status: query.status || null,
    from: query.from || null,
    to: query.to || null,
    search: query.search || null
  };

  const rows = await searchPrescriptions(filters);

  return rows.map(row => ({
    ...row,
    clientName: `${row.clientFirstName} ${row.clientLastName}`.trim(),
    status: row.status || 'Pending'
  }));
}

export default { getPrescriptionList };