import * as generalAdminService from '../services/general-admin.service.js';

export async function getPharmacistAdmins(req, res) {
  try {
    const admins = await generalAdminService.getPharmacistAdmins();
    res.json({ success: true, data: admins, count: admins.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pharmacist admins', error: error.message });
  }
}

export async function getAdminPerformance(req, res) {
  try {
    const performance = await generalAdminService.getAdminPerformance(req.params.adminId);
    if (!performance) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admin performance', error: error.message });
  }
}