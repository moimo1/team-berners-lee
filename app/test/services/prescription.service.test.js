import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/models/prescription.model.js', () => ({
  searchPrescriptions: jest.fn(),
  getPrescriptionById: jest.fn(),
}));

const model = await import('../../src/models/prescription.model.js');
const service = await import('../../src/services/prescription.service.js');

describe('prescription.service (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('searchPrescriptions returns rows from model', async () => {
    const rows = [{ id: 2, patient_name: 'Bob' }];
    model.searchPrescriptions.mockResolvedValue(rows);

    const result = await service.searchPrescriptions({ patient: 'Bob' });
    expect(model.searchPrescriptions).toHaveBeenCalledWith({ patient: 'Bob' });
    expect(result).toEqual(rows);
  });

  test('getPrescriptionDetails returns a prescription', async () => {
    const row = { id: 5, patient_name: 'Carol' };
    model.getPrescriptionById.mockResolvedValue(row);

    const result = await service.getPrescriptionDetails(5);
    expect(model.getPrescriptionById).toHaveBeenCalledWith(5);
    expect(result).toEqual(row);
  });
});