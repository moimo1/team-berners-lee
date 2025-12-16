
export function createPharmacist(data) {
  return {
    id: data.id || data.pharmaID,
    pharmaID: data.pharmaID || data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    location: data.location,
    handled: data.handled || 0
  };
}

