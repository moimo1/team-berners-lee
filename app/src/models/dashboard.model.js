import { getConnection } from '../config/db.js';

export async function getStats() {
  const conn = await getConnection();
  try {
    const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM prescription');
    const [[{ fulfilled }]] = await conn.query('SELECT COUNT(*) AS fulfilled FROM dispense');
    
    // Calculate pending (Total Prescriptions - Total Dispensed)
    const pending = Math.max(total - fulfilled, 0);
    const escalations = 0; // Placeholder logic as requested

    return [
      { status: 'completed', count: fulfilled },
      { status: 'pending', count: pending },
      { status: 'escalations', count: escalations },
    ];
  } finally {
    conn.release();
  }
}

export async function getPharmacists() {
  const conn = await getConnection();
  try {
    // Counts how many dispenses each pharmacist has handled
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

export async function getRecentPrescriptions() {
  const conn = await getConnection();
  try {
    // Joins tables to get readable names instead of IDs
    const [rows] = await conn.query(
      `SELECT pr.prescID,
              m.genericName AS medicineName,
              c.firstName AS clientFirstName,
              c.lastName AS clientLastName,
              CONCAT(ph.firstName, ' ', ph.lastName) AS pharmacistName,
              CASE WHEN d.dispenseID IS NOT NULL THEN 'Fulfilled' ELSE 'Pending' END AS status,
              pr.dateGiven
       FROM prescription pr
       LEFT JOIN prescriptiondetails pd ON pd.prescID = pr.prescID
       LEFT JOIN medicine m ON m.medID = pd.medID
       LEFT JOIN client c ON c.clientID = pr.clientID
       LEFT JOIN dispense d ON d.prescID = pr.prescID
       LEFT JOIN pharmacist ph ON ph.pharmaID = d.pharmaID
       ORDER BY pr.dateGiven DESC
       LIMIT 10`
    );
    return rows;
  } finally {
    conn.release();
  }
}