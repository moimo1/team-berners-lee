import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/config/db.js', () => ({
  getConnection: jest.fn(),
}));

const db = await import('../../src/config/db.js');
const model = await import('../../src/models/dashboard.model.js');

describe('dashboard.model (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getStats returns stats rows', async () => {
    const fakeRows = [{ status: 'completed', count: 5 }];
    const mockConnection = { execute: jest.fn().mockResolvedValue([fakeRows]), release: jest.fn() };
    db.getConnection.mockResolvedValue(mockConnection);

    const rows = await model.getStats();
    expect(db.getConnection).toHaveBeenCalled();
    expect(mockConnection.execute).toHaveBeenCalled();
    expect(rows).toEqual(fakeRows);
  });

  test('getPharmacists returns pharmacist rows', async () => {
    const fakeRows = [{ id: 1, name: 'Pharm A', prescription_count: 10 }];
    const mockConnection = { execute: jest.fn().mockResolvedValue([fakeRows]), release: jest.fn() };
    db.getConnection.mockResolvedValue(mockConnection);

    const rows = await model.getPharmacists();
    expect(mockConnection.execute).toHaveBeenCalled();
    expect(rows).toEqual(fakeRows);
  });

  test('getRecentPrescriptions returns recent rows', async () => {
    const fakeRows = [{ id: 2, patient_name: 'P' }];
    const mockConnection = { execute: jest.fn().mockResolvedValue([fakeRows]), release: jest.fn() };
    db.getConnection.mockResolvedValue(mockConnection);

    const rows = await model.getRecentPrescriptions();
    expect(mockConnection.execute).toHaveBeenCalled();
    expect(rows).toEqual(fakeRows);
  });
});