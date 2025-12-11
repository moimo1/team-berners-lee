/**
 * Model: Patient data structure
 * Maps from "client" table in database
 */
export function createPatient(data) {
    return {
        id: data.clientID || data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.clientAddress || data.address
    };
}
