import * as userRepo from '../repositories/user-management.repository.js';
import { createDoctor as formatDoctor } from '../models/Doctor.js';
import { createPatient as formatPatient } from '../models/Patient.js';
import { createPharmacist as formatPharmacist } from '../models/Pharmacist.js';

export async function getDoctors(filters) {
    const data = await userRepo.searchDoctors(filters);
    return data.map(formatDoctor);
}

export async function getDoctor(id) {
    const data = await userRepo.getDoctorById(id);
    if (!data) return null;
    return formatDoctor(data);
}

export async function updateDoctor(id, updates) {
    return await userRepo.updateDoctor(id, updates);
}

export async function getPatients(filters) {
    const data = await userRepo.searchPatients(filters);
    return data.map(formatPatient);
}

export async function getPatient(id) {
    const data = await userRepo.getPatientById(id);
    if (!data) return null;
    return formatPatient(data);
}

export async function updatePatient(id, updates) {
    return await userRepo.updatePatient(id, updates);
}

export async function getPharmacists(filters) {
    const data = await userRepo.searchPharmacists(filters);
    return data.map(formatPharmacist);
}

export async function getPharmacist(id) {
    const data = await userRepo.getPharmacistById(id);
    if (!data) return null;
    return formatPharmacist(data);
}

export async function updatePharmacist(id, updates) {
    return await userRepo.updatePharmacist(id, updates);
}

export async function deleteDoctor(id) {
    return await userRepo.deleteDoctor(id);
}

export async function deletePatient(id) {
    return await userRepo.deletePatient(id);
}

export async function deletePharmacist(id) {
    return await userRepo.deletePharmacist(id);
}

export async function createDoctor(data) {
    return await userRepo.createDoctor(data);
}

export async function createPatient(data) {
    return await userRepo.createPatient(data);
}

export async function createPharmacist(data) {
    return await userRepo.createPharmacist(data);
}
