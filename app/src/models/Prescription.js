/**
 * Model: Prescription data structure
 * Simple function that creates a prescription object
 */
export function createPrescription(data) {
  // Build client name from first and last name
  const clientName = data.clientName || 
    `${data.clientFirstName || ''} ${data.clientLastName || ''}`.trim();
  
  // Determine status based on dispenseId
  const status = data.dispenseId ? 'Fulfilled' : (data.status || 'Pending');
  
  // Build pharmacist name if available
  const pharmacistName = data.pharmacistName || 
    (data.pharmacistFirstName && data.pharmacistLastName
      ? `${data.pharmacistFirstName} ${data.pharmacistLastName}`
      : null);

  // Return a plain object (data structure)
  return {
    prescID: data.prescID,
    medicineName: data.medicineName,
    clientFirstName: data.clientFirstName,
    clientLastName: data.clientLastName,
    clientName: clientName,
    pharmacistName: pharmacistName,
    pharmacistId: data.pharmacistId,
    status: status,
    dateGiven: data.dateGiven,
    dispenseId: data.dispenseId
  };
}

