/**
 * Model: Pharmacist data structure
 * Simple function that creates a pharmacist object
 */
export function createPharmacist(data) {
  // Return a plain object (data structure)
  return {
    id: data.id || data.pharmaID,
    pharmaID: data.pharmaID || data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    location: data.location,
    handled: data.handled || 0
  };
}

