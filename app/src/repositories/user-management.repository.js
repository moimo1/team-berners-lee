import { getConnection } from '../config/db.js';

// doctor
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

// patient
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

// pharmacist
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

export async function deleteDoctor(id) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('DELETE FROM doctor WHERE doctorID = ?', [id]);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}

export async function deletePatient(id) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('DELETE FROM client WHERE clientID = ?', [id]);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}

export async function deletePharmacist(id) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('DELETE FROM pharmacist WHERE pharmaID = ?', [id]);
        return result.affectedRows > 0;
    } finally {
        conn.release();
    }
}

// Helpers for ID generation
async function generateId(conn, table, idColumn, prefix, substringStart = 2) {
    const [rows] = await conn.query(`SELECT MAX(CAST(SUBSTRING(${idColumn}, ${substringStart}) AS UNSIGNED)) as maxNum FROM ${table}`);
    const nextNum = (rows[0].maxNum || 0) + 1;
    return prefix + String(nextNum).padStart(3, '0');
}

export async function createDoctor(data) {
    const conn = await getConnection();
    try {
        const newID = await generateId(conn, 'doctor', 'doctorID', 'D');
        const sql = 'INSERT INTO doctor (doctorID, firstName, lastName, specialty, phonenum, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await conn.query(sql, [
            newID,
            data.firstName,
            data.lastName,
            data.specialty || '',
            data.phonenum || '',
            data.email,
            data.password
        ]);
        return { id: newID, ...data };
    } finally {
        conn.release();
    }
}

export async function createPatient(data) {
    const conn = await getConnection();
    try {
        const newID = await generateId(conn, 'client', 'clientID', 'C');
        // Check if birthdate is present, default to null if not (though schema might require it, basic validation is in controller)
        const sql = 'INSERT INTO client (clientID, firstName, lastName, address, email, password, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await conn.query(sql, [
            newID,
            data.firstName,
            data.lastName,
            data.address || '',
            data.email,
            data.password,
            data.birthdate || null
        ]);
        return { id: newID, ...data };
    } finally {
        conn.release();
    }
}

export async function createPharmacist(data) {
    const conn = await getConnection();
    try {
        const newID = await generateId(conn, 'pharmacist', 'pharmaID', 'PH', 3);
        // Note: Pharmacist table uses 'location' often for designation in this codebase context
        const sql = 'INSERT INTO pharmacist (pharmaID, firstName, lastName, location, email, password) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await conn.query(sql, [
            newID,
            data.firstName,
            data.lastName,
            data.location || '',
            data.email,
            data.password
        ]);
        return { id: newID, ...data };
    } finally {
        conn.release();
    }
}
