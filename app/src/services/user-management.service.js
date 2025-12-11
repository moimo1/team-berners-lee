import * as userRepo from '../repositories/user-management.repository.js';
import { createDoctor } from '../models/Doctor.js';
import { createPatient } from '../models/Patient.js';
import { createPharmacist } from '../models/Pharmacist.js';

export async function getDoctors(filters) {
    const data = await userRepo.searchDoctors(filters);
    return data.map(createDoctor);
}

export async function getDoctor(id) {
    const data = await userRepo.getDoctorById(id);
    if (!data) return null;
    return createDoctor(data);
}

export async function updateDoctor(id, updates) {
    return await userRepo.updateDoctor(id, updates);
}

export async function getPatients(filters) {
    const data = await userRepo.searchPatients(filters);
    return data.map(createPatient);
}

export async function getPatient(id) {
    const data = await userRepo.getPatientById(id);
    if (!data) return null;
    return createPatient(data);
}

export async function updatePatient(id, updates) {
    return await userRepo.updatePatient(id, updates);
}

export async function getPharmacists(filters) {
    const data = await userRepo.searchPharmacists(filters);
    return data.map(createPharmacist);
}

export async function getPharmacist(id) {
    const data = await userRepo.getPharmacistById(id);
    if (!data) return null;
    return createPharmacist(data);
}

export async function updatePharmacist(id, updates) {
    return await userRepo.updatePharmacist(id, updates);
}
