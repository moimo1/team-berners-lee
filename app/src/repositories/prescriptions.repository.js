import { getConnection } from '../config/db.js';

export async function searchPrescriptions(filters = {}) {
  const conn = await getConnection();
  try {
    let sql = `
      SELECT 
        pr.prescID,
        ANY_VALUE(m.genericName) AS medicineName,
        ANY_VALUE(c.firstName) AS clientFirstName,
        ANY_VALUE(c.lastName) AS clientLastName,
        ANY_VALUE(ph.firstName) AS pharmacistFirstName,
        ANY_VALUE(ph.lastName) AS pharmacistLastName,
        ANY_VALUE(ph.pharmaID) AS pharmacistId,
        ANY_VALUE(d.dispenseID) AS dispenseId,
        ANY_VALUE(pd.remainingAmount) AS remainingAmount,
        ANY_VALUE(pd.dosage) AS dosage,
        ANY_VALUE(pd.description) AS description,
        GREATEST(pr.dateGiven, COALESCE(MAX(d.dateDispensed), pr.dateGiven)) AS updatedAt
      FROM prescription pr
      LEFT JOIN prescriptiondetails pd ON pd.prescID = pr.prescID
      LEFT JOIN medicine m ON m.medID = pd.medID
      LEFT JOIN client c ON c.clientID = pr.clientID
      LEFT JOIN dispense d ON d.prescID = pr.prescID
      LEFT JOIN pharmacist ph ON ph.pharmaID = d.pharmaID
      WHERE 1=1
    `;

    const params = [];

    if (filters.pharmacistId) {
      sql += ` AND d.pharmaID = ?`;
      params.push(filters.pharmacistId);
    }

    if (filters.location) {
      sql += ` AND ph.location = ?`;
      params.push(filters.location);
    }

    if (filters.from) {
      sql += ` AND pr.dateGiven >= ?`;
      params.push(filters.from);
    }
    if (filters.to) {
      sql += ` AND pr.dateGiven <= ?`;
      params.push(filters.to);
    }

    if (filters.search) {
      sql += ` AND (
        pr.prescID LIKE ? OR 
        c.firstName LIKE ? OR 
        c.lastName LIKE ? OR 
        m.genericName LIKE ?
      )`;
      const term = `%${filters.search}%`;
      params.push(term, term, term, term);
    }

    if (filters.status) {
      if (filters.status === 'Fulfilled' || filters.status === 'Collected') {
        sql += ` AND d.dispenseID IS NOT NULL`;
      } else if (filters.status === 'Pending') {
        sql += ` AND d.dispenseID IS NULL`;
      }
    }

    sql += ` GROUP BY pr.prescID ORDER BY updatedAt DESC LIMIT 50`;

    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

