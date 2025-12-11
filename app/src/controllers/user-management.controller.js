import * as userService from '../services/user-management.service.js';

// doctor
export async function getDoctors(req, res) {
    try {
        const doctors = await userService.getDoctors(req.query);
        res.json({ success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch doctors' });
    }
}

export async function getDoctor(req, res) {
    try {
        const doctor = await userService.getDoctor(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch doctor details' });
    }
}

export async function updateDoctor(req, res) {
    try {
        const success = await userService.updateDoctor(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Doctor not found or no changes made' });
        }
        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update doctor' });
    }
}

// patient
export async function getPatients(req, res) {
    try {
        const patients = await userService.getPatients(req.query);
        res.json({ success: true, data: patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch patients' });
    }
}

export async function getPatient(req, res) {
    try {
        const patient = await userService.getPatient(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch patient details' });
    }
}

export async function updatePatient(req, res) {
    try {
        const success = await userService.updatePatient(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Patient not found or no changes made' });
        }
        res.json({ success: true, message: 'Patient updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update patient' });
    }
}

// pharmacist
export async function getPharmacists(req, res) {
    try {
        const pharmacists = await userService.getPharmacists(req.query);
        res.json({ success: true, data: pharmacists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch pharmacists' });
    }
}

export async function getPharmacist(req, res) {
    try {
        const pharmacist = await userService.getPharmacist(req.params.id);
        if (!pharmacist) {
            return res.status(404).json({ success: false, error: 'Pharmacist not found' });
        }
        res.json({ success: true, data: pharmacist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch pharmacist details' });
    }
}

export async function updatePharmacist(req, res) {
    try {
        const success = await userService.updatePharmacist(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Pharmacist not found or no changes made' });
        }
        res.json({ success: true, message: 'Pharmacist updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update pharmacist' });
    }
}
