import { getPharmacistHistory } from '../repositories/pharmacist-history.repository.js';



export async function getHistory(pharmacistId) {
    const rows = await getPharmacistHistory(pharmacistId);

    return rows.map(row => {
        let details = `Dispensed ${row.quantity || '?'} ${row.medicineName} to ${row.clientFirstName} ${row.clientLastName}`;

        if (row.remainingAmount !== null && row.remainingAmount <= 0) {
            details += ' (Prescription Fulfilled)';
        }

        details += ` (Prescription #${row.prescID})`;

        return {
            type: 'Dispense',
            timestamp: row.dateDispensed,
            description: details
        };
    });
}
