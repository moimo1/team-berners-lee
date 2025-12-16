import { getPharmacistHistory } from '../repositories/pharmacist-history.repository.js';



export async function getHistory(pharmacistId) {
    const rows = await getPharmacistHistory(pharmacistId);

    return rows.map(row => ({
        type: 'Dispense',
        timestamp: row.dateDispensed,
        description: `Dispensed ${row.medicineName} to ${row.clientFirstName} ${row.clientLastName} (Prescription #${row.prescID})`
    }));
}
