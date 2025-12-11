/**
 * Model: Doctor data structure
 */
export function createDoctor(data) {
    return {
        id: data.doctorID || data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        specialization: data.doctorSpecialization || data.specialization,
        // Add other fields as necessary from database
    };
}
