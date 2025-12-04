const prescriptionModel = require('../models/prescription.model');

const searchPrescriptions = async (filters) => {
  const prescriptions = await prescriptionModel.searchPrescriptions(filters);
  return prescriptions;
};

const getPrescriptionDetails = async (id) => {
  const prescription = await prescriptionModel.getPrescriptionById(id);
  return prescription;
};

module.exports = {
  searchPrescriptions,
  getPrescriptionDetails,
};