import { getConnection } from '../config/db.js';

// DASHBOARD STATS 
export async function getStats() {
  const connection = await getConnection();
  const [rows] = await connection.execute('SELECT status, COUNT(*) as count FROM prescriptions GROUP BY status');
  connection.release();
  return rows;
}

// PHARMACIST OVERVIEW 
export async function getPharmacists() {
  const connection = await getConnection();
  const [rows] = await connection.execute(`
    SELECT p.id, p.name, COUNT(pr.id) as prescription_count
    FROM pharmacists p
    LEFT JOIN prescriptions pr ON pr.assigned_pharmacist_id = p.id
    GROUP BY p.id, p.name
    ORDER BY prescription_count DESC
  `);
  connection.release();
  return rows;
}

// RECENT PRESCRIPTIONS
export async function getRecentPrescriptions(limit = 5) {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT id, patient_name, status, created_at FROM prescriptions ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  connection.release();
  return rows;
}