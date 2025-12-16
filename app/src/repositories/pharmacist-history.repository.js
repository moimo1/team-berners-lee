import { getConnection } from '../config/db.js';

export async function getPharmacistHistory(pharmacistId) {
  const conn = await getConnection();
  try {
    const sql = `
      SELECT 
        d.dispenseID,
        d.dateDispensed,
        pr.prescID,
        m.genericName AS medicineName,
        c.firstName AS clientFirstName,
        c.lastName AS clientLastName
      FROM dispense d
      JOIN prescription pr ON pr.prescID = d.prescID
      LEFT JOIN prescriptiondetails pd ON pd.prescID = pr.prescID
      LEFT JOIN medicine m ON m.medID = pd.medID
      LEFT JOIN client c ON c.clientID = pr.clientID
      WHERE d.pharmaID = ?
      ORDER BY d.dateDispensed DESC
      LIMIT 50
    `;

    const [rows] = await conn.query(sql, [pharmacistId]);
    return rows;
  } finally {
    conn.release();
  }
}
