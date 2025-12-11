import { getConnection } from '../config/db.js';

/**
 * Repository: User Management
 * Handles CRUD operations for Doctors, Patients (Clients), and Pharmacists
 */

// --- DOCTOR OPERATIONS ---

export async function searchDoctors(filters = {}) {
    const conn = await getConnection();
    try {
        let sql = 'SELECT * FROM doctor WHERE 1=1';
        const params = [];

        if (filters.search) {
            sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term, term);
        }

        const [rows] = await conn.query(sql, params);
        return rows;
    } finally {
        conn.release();
    }
}

export async function getDoctorById(id) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM doctor WHERE doctorID = ?', [id]);
        return rows[0] || null;
    } finally {
        conn.release();
    }
}

export async function updateDoctor(id, data) {
    const conn = await getConnection();
    try {
        // Only update fields that are provided
        const fields = [];
        const params = [];

        if (data.firstName !== undefined) { fields.push('firstName = ?'); params.push(data.firstName); }
        if (data.lastName !== undefined) { fields.push('lastName = ?'); params.push(data.lastName); }
        if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
        if (data.specialization !== undefined) { fields.push('doctorSpecialization = ?'); params.push(data.specialization); }

        if (fields.length === 0) return false;

        params.push(id);
        const [result] = await conn.query(`UPDATE doctor SET ${fields.join(', ')} WHERE doctorID = ?`, params);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}

// --- PATIENT (CLIENT) OPERATIONS ---

export async function searchPatients(filters = {}) {
    const conn = await getConnection();
    try {
        let sql = 'SELECT * FROM client WHERE 1=1';
        const params = [];

        if (filters.search) {
            sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term, term);
        }

        const [rows] = await conn.query(sql, params);
        return rows;
    } finally {
        conn.release();
    }
}

export async function getPatientById(id) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM client WHERE clientID = ?', [id]);
        return rows[0] || null;
    } finally {
        conn.release();
    }
}

export async function updatePatient(id, data) {
    const conn = await getConnection();
    try {
        const fields = [];
        const params = [];

        if (data.firstName !== undefined) { fields.push('firstName = ?'); params.push(data.firstName); }
        if (data.lastName !== undefined) { fields.push('lastName = ?'); params.push(data.lastName); }
        if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
        if (data.address !== undefined) { fields.push('clientAddress = ?'); params.push(data.address); }

        if (fields.length === 0) return false;

        params.push(id);
        const [result] = await conn.query(`UPDATE client SET ${fields.join(', ')} WHERE clientID = ?`, params);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}

// --- PHARMACIST OPERATIONS ---

export async function searchPharmacists(filters = {}) {
    const conn = await getConnection();
    try {
        let sql = 'SELECT * FROM pharmacist WHERE 1=1';
        const params = [];

        if (filters.search) {
            sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term, term);
        }

        // Admin ID/Location filtering could be applied here if we want to restrict this too,
        // but the requirement is generally "Admin can manage users". 
        // If strict location rule applies here too:
        if (filters.location) {
            sql += ' AND location = ?';
            params.push(filters.location);
        }

        const [rows] = await conn.query(sql, params);
        return rows;
    } finally {
        conn.release();
    }
}

export async function getPharmacistById(id) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM pharmacist WHERE pharmaID = ?', [id]);
        return rows[0] || null;
    } finally {
        conn.release();
    }
}

export async function updatePharmacist(id, data) {
    const conn = await getConnection();
    try {
        const fields = [];
        const params = [];

        if (data.firstName !== undefined) { fields.push('firstName = ?'); params.push(data.firstName); }
        if (data.lastName !== undefined) { fields.push('lastName = ?'); params.push(data.lastName); }
        if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
        if (data.location !== undefined) { fields.push('location = ?'); params.push(data.location); }

        if (fields.length === 0) return false;

        params.push(id);
        const [result] = await conn.query(`UPDATE pharmacist SET ${fields.join(', ')} WHERE pharmaID = ?`, params);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}
