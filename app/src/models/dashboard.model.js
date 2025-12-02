import { db } from "../config/db.js";

// DASHBOARD STATS 
export async function getStats() {
  const [[salesCount]] = await db.query(`SELECT COUNT(*) AS count FROM dispense`);
  const [[totalCount]] = await db.query(`SELECT COUNT(*) AS count FROM prescription`);
  const pendingCount = totalCount.count - salesCount.count;

  return {
    completed: salesCount.count,
    pending: pendingCount > 0 ? pendingCount : 0,
    escalations: 0
  };
}

// PHARMACIST OVERVIEW 
export async function getPharmacists() {
  const [rows] = await db.query(`
    SELECT 
      ph.pharmaID,
      ph.firstName,
      ph.lastName,
      ph.location AS shift,
      ph.email,
      
      COUNT(d.dispenseID) AS handled

    FROM pharmacist ph
    LEFT JOIN dispense d 
        ON TRIM(ph.pharmaID) = TRIM(d.pharmaID)
    GROUP BY ph.pharmaID, ph.firstName, ph.lastName, ph.location, ph.email
    ORDER BY handled DESC
  `);

  return rows;
}

// RECENT PRESCRIPTIONS
export async function getRecentPrescriptions() {
  const [rows] = await db.query(`
    SELECT 
        p.prescID,
        c.firstName AS clientFirstName,
        c.lastName AS clientLastName,
        (SELECT m.genericName FROM prescriptiondetails pd JOIN medicine m ON pd.medID = m.medID WHERE pd.prescID = p.prescID LIMIT 1) AS medicineName,
        CONCAT(ph.firstName, ' ', ph.lastName) AS pharmacistName,
        CASE 
            WHEN d.dispenseID IS NOT NULL THEN 'Fulfilled'
            WHEN p.dateExpiry < CURRENT_DATE THEN 'Requires Review'
            ELSE 'Pending'
        END AS status
    FROM prescription p
    JOIN client c ON p.clientID = c.clientID
    LEFT JOIN dispense d ON p.prescID = d.prescID
    LEFT JOIN pharmacist ph ON d.pharmaID = ph.pharmaID
    ORDER BY p.dateGiven DESC
    LIMIT 10
  `);

  return rows;
}