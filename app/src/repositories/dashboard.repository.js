import { getConnection } from '../config/db.js';

// Get total count of prescriptions from database
export async function getTotalPrescriptions(filters = {}) {
  const conn = await getConnection();
  try {
    let sql = 'SELECT COUNT(pr.prescID) AS total FROM prescription pr';
    const params = [];

    if (filters.location) {
      sql += ` LEFT JOIN dispense d ON d.prescID = pr.prescID
               LEFT JOIN pharmacist p ON p.pharmaID = d.pharmaID
               WHERE p.location = ?`;
      params.push(filters.location);
    }

    const [[{ total }]] = await conn.query(sql, params);
    return total;
  } finally {
    conn.release();
  }
}

// Get count of fulfilled prescriptions from database
export async function getFulfilledPrescriptions(filters = {}) {
  const conn = await getConnection();
  try {
    let sql = 'SELECT COUNT(d.dispenseID) AS fulfilled FROM dispense d';
    const params = [];

    if (filters.location) {
      sql += ' JOIN pharmacist p ON p.pharmaID = d.pharmaID WHERE p.location = ?';
      params.push(filters.location);
    }

    const [[{ fulfilled }]] = await conn.query(sql, params);
    return fulfilled;
  } finally {
    conn.release();
  }
}

// Get all pharmacists with their handled prescription count from database
export async function getPharmacists(filters = {}) {
  const conn = await getConnection();
  try {
    let sql = `SELECT p.pharmaID AS id,
              p.firstName,
              p.lastName,
              p.location,
              COUNT(d.dispenseID) AS handled
       FROM pharmacist p
       LEFT JOIN dispense d ON d.pharmaID = p.pharmaID`;

    const params = [];

    if (filters.location) {
      sql += ' WHERE p.location = ?';
      params.push(filters.location);
    }

    sql += ` GROUP BY p.pharmaID, p.firstName, p.lastName, p.location
             ORDER BY p.firstName, p.lastName`;

    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

// Get recent prescriptions with related data from database
export async function getRecentPrescriptions(filters = {}) {
  const conn = await getConnection();
  try {
    let sql = `SELECT pr.prescID,
              m.genericName AS medicineName,
              c.firstName AS clientFirstName,
              c.lastName AS clientLastName,
              ph.firstName AS pharmacistFirstName,
              ph.lastName AS pharmacistLastName,
              ph.pharmaID AS pharmacistId,
              d.dispenseID AS dispenseId,
              pr.dateGiven
       FROM prescription pr
       LEFT JOIN prescriptiondetails pd ON pd.prescID = pr.prescID
       LEFT JOIN medicine m ON m.medID = pd.medID
       LEFT JOIN client c ON c.clientID = pr.clientID
       LEFT JOIN dispense d ON d.prescID = pr.prescID
       LEFT JOIN pharmacist ph ON ph.pharmaID = d.pharmaID
       WHERE 1=1`;

    const params = [];

    if (filters.location) {
      sql += ` AND ph.location = ?`;
      params.push(filters.location);
    }

    sql += ` ORDER BY pr.dateGiven DESC LIMIT ?`;
    params.push(filters.limit || 10);

    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

