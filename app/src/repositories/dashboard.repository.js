import { getConnection } from '../config/db.js';

/**
 * Repository: Data access layer for dashboard
 * Simple functions that do database queries
 */

// Get total count of prescriptions from database
export async function getTotalPrescriptions() {
  const conn = await getConnection();
  try {
    const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM prescription');
    return total;
  } finally {
    conn.release();
  }
}

// Get count of fulfilled prescriptions from database
export async function getFulfilledPrescriptions() {
  const conn = await getConnection();
  try {
    const [[{ fulfilled }]] = await conn.query('SELECT COUNT(*) AS fulfilled FROM dispense');
    return fulfilled;
  } finally {
    conn.release();
  }
}

// Get all pharmacists with their handled prescription count from database
export async function getPharmacists() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT p.pharmaID AS id,
              p.firstName,
              p.lastName,
              p.location,
              COUNT(d.dispenseID) AS handled
       FROM pharmacist p
       LEFT JOIN dispense d ON d.pharmaID = p.pharmaID
       GROUP BY p.pharmaID, p.firstName, p.lastName, p.location
       ORDER BY p.firstName, p.lastName`
    );
    return rows;
  } finally {
    conn.release();
  }
}

// Get recent prescriptions with related data from database
export async function getRecentPrescriptions(limit = 10) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT pr.prescID,
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
       ORDER BY pr.dateGiven DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  } finally {
    conn.release();
  }
}

