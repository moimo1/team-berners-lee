import { getPharmacistHistory } from '../repositories/pharmacist-history.repository.js';

/**
 * Service: Business logic for pharmacist history
 */

export async function getHistory(pharmacistId) {
    // Step 1: Get raw data
    const rows = await getPharmacistHistory(pharmacistId);

    // Step 2: Transform if needed
    // Currently just returning raw data but formatted for specific usage if needed
    return rows.map(row => ({
        type: 'Dispense', // In the future, could be other actions
        timestamp: row.dateDispensed,
        description: `Dispensed ${row.medicineName} to ${row.clientFirstName} ${row.clientLastName} (Prescription #${row.prescID})`
    }));
}
