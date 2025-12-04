import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/services/prescription.service.js', () => ({
  searchPrescriptions: jest.fn(),
  getPrescriptionDetails: jest.fn(),
}));

const prescriptionService = await import('../../src/services/prescription.service.js');
const controller = await import('../../src/controllers/prescription.controller.js');

describe('prescription.controller (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('searchPrescriptions returns data and count', async () => {
    const fakeData = [{ id: 1, patient_name: 'Alice' }];
    prescriptionService.searchPrescriptions.mockResolvedValue(fakeData);

    const req = { query: { patient: 'Ali' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await controller.searchPrescriptions(req, res);

    expect(prescriptionService.searchPrescriptions).toHaveBeenCalledWith(expect.objectContaining({ patient: 'Ali' }));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: fakeData,
      count: fakeData.length,
    }));
  });

  test('getPrescriptionDetails returns 404 when not found', async () => {
    prescriptionService.getPrescriptionDetails.mockResolvedValue(null);
    const req = { params: { id: '999' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await controller.getPrescriptionDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Prescription not found' }));
  });
});