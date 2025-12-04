const db = require('../config/db');

const searchPrescriptions = async (filters = {}) => {
  let query = 'SELECT * FROM prescriptions WHERE 1=1';
  const params = [];

  if (filters.patient) {
    query += ' AND patient_name LIKE ?';
    params.push(`%${filters.patient}%`);
  }

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.pharmacist) {
    query += ' AND assigned_pharmacist_id = ?';
    params.push(filters.pharmacist);
  }

  if (filters.dateFrom) {
    query += ' AND created_at >= ?';
    params.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    query += ' AND created_at <= ?';
    params.push(filters.dateTo);
  }

  if (filters.sortBy && ['created_at', 'status', 'patient_name'].includes(filters.sortBy)) {
    const order = filters.order === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${filters.sortBy} ${order}`;
  } else {
    query += ' ORDER BY created_at DESC';
  }

  const limit = parseInt(filters.limit) || 10;
  const offset = parseInt(filters.offset) || 0;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const connection = await db.getConnection();
  const [rows] = await connection.execute(query, params);
  connection.release();

  return rows;
};

const getPrescriptionById = async (id) => {
  const connection = await db.getConnection();
  const [rows] = await connection.execute('SELECT * FROM prescriptions WHERE id = ?', [id]);
  connection.release();

  return rows[0] || null;
};

module.exports = {
  searchPrescriptions,
  getPrescriptionById,
};