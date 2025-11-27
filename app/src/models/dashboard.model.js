import { db } from "../config/db.js";

// DASHBOARD STATS
export async function getStats() {
  const [[prescCount]] = await db.query(`
    SELECT COUNT(*) AS totalPrescriptions
    FROM prescription
  `);

  const [[clientCount]] = await db.query(`
    SELECT COUNT(*) AS totalClients
    FROM client
  `);

  const [[doctorCount]] = await db.query(`
    SELECT COUNT(*) AS totalDoctors
    FROM doctor
  `);

  const [[medicineCount]] = await db.query(`
    SELECT COUNT(*) AS totalMedicines
    FROM medicine
  `);

  return {
    totalPrescriptions: prescCount.totalPrescriptions,
    totalClients: clientCount.totalClients,
    totalDoctors: doctorCount.totalDoctors,
    totalMedicines: medicineCount.totalMedicines
  };
}


// PHARMACIST OVERVIEW
export async function getPharmacists() {
  const [rows] = await db.query(`
    SELECT 
      ph.pharmaID,
      ph.firstName,
      ph.lastName,
      ph.location,
      ph.email,
      COUNT(p.prescID) AS handledPrescriptions
    FROM pharmacist ph
    LEFT JOIN prescription p 
        ON ph.pharmaID = p.doctorID  -- pharmacist does NOT exist in prescription table
    GROUP BY ph.pharmaID
  `);

  return rows;
}


// RECENT PRESCRIPTIONS
export async function getRecentPrescriptions() {
  const [rows] = await db.query(`
    SELECT 
        p.prescID,
        d.firstName AS doctorFirst,
        d.lastName AS doctorLast,
        c.firstName AS clientFirst,
        c.lastName AS clientLast,
        p.dateGiven,
        p.dateExpiry,
        COUNT(pd.medID) AS totalMedicines
    FROM prescription p
    JOIN doctor d ON p.doctorID = d.doctorID
    JOIN client c ON p.clientID = c.clientID
    LEFT JOIN prescriptiondetails pd 
        ON p.prescID = pd.prescID
    GROUP BY p.prescID
    ORDER BY p.dateGiven DESC
    LIMIT 10
  `);

  return rows.map(r => ({
    prescID: r.prescID,
    doctorName: `${r.doctorFirst} ${r.doctorLast}`,
    clientName: `${r.clientFirst} ${r.clientLast}`,
    dateGiven: r.dateGiven,
    dateExpiry: r.dateExpiry,
    totalMedicines: r.totalMedicines
  }));
}
