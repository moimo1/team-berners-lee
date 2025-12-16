
export function createPrescription(data) {
  const clientName = data.clientName ||
    `${data.clientFirstName || ''} ${data.clientLastName || ''}`.trim();

  const status = data.dispenseId ? 'Fulfilled' : (data.status || 'Pending');

  const pharmacistName = data.pharmacistName ||
    (data.pharmacistFirstName && data.pharmacistLastName
      ? `${data.pharmacistFirstName} ${data.pharmacistLastName}`
      : null);

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

