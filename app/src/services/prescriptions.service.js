import { searchPrescriptions } from '../repositories/prescriptions.repository.js';
import { createPrescription } from '../models/Prescription.js';

/**
 * Service: Business logic layer for prescriptions
 * This is where we apply business rules and transform data
 */

// Get prescription list with filters applied
export async function getPrescriptionList(query) {
  // Step 1: Prepare filters from query parameters
  // Business logic: Normalize and validate filters
  const filters = {
    pharmacistId: query.pharmacistId || null,
    status: query.status || null,
    from: query.from || null,
    to: query.to || null,
    search: query.search || null
  };

  // Step 2: Get raw data from database (repository layer)
  const rows = await searchPrescriptions(filters);

  // Step 3: Transform raw data into prescription models (data structures)
  const prescriptions = rows.map(row => {
    // Business logic: Determine status based on dispenseId
    // There is no "status" field in the database
    // Instead, we check if a record exists in the "dispense" table:
    // - If dispenseId exists (not null) = prescription was fulfilled/dispensed
    // - If dispenseId is null = prescription is still pending
    //
    // NOTE: Currently, dispense records are NOT automatically created when
    // remainingAmount reaches 0. A dispense record must be manually created
    // (or through a separate process) to mark a prescription as fulfilled.
    // The update-prescription-amount.php only updates remainingAmount but
    // does not create dispense records.
    const status = row.dispenseId ? 'Fulfilled' : 'Pending';
    
    // Build pharmacist name from first and last name
    const pharmacistName = row.pharmacistFirstName && row.pharmacistLastName
      ? `${row.pharmacistFirstName} ${row.pharmacistLastName}`
      : null;

    return createPrescription({
      ...row,
      status,
      pharmacistName
    });
  });

  // Step 4: Return the transformed data
  return prescriptions;
}