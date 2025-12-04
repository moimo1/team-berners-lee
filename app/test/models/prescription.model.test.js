import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/config/db.js', () => ({
  getConnection: jest.fn(),
}));

const db = await import('../../src/config/db.js');
const model = await import('../../src/models/prescription.model.js');

describe('prescription.model (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('searchPrescriptions returns rows', async () => {
    const fakeRows = [{ id: 10, patient_name: 'Test' }];
    const mockConnection = {
      execute: jest.fn().mockResolvedValue([fakeRows]),
      release: jest.fn(),
    };
    db.getConnection.mockResolvedValue(mockConnection);

    const rows = await model.searchPrescriptions({ patient: 'Test', limit: 5, offset: 0 });
    expect(db.getConnection).toHaveBeenCalled();
    expect(mockConnection.execute).toHaveBeenCalled();
    expect(rows).toEqual(fakeRows);
  });

  test('getPrescriptionById returns single row or null', async () => {
    const fakeRow = [{ id: 99, patient_name: 'Zoe' }];
    const mockConnection = {
      execute: jest.fn().mockResolvedValue([fakeRow]),
      release: jest.fn(),
    };
    db.getConnection.mockResolvedValue(mockConnection);

    const row = await model.getPrescriptionById(99);
    expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM prescriptions WHERE id = ?', [99]);
    expect(row).toEqual(fakeRow[0]);
  });
});