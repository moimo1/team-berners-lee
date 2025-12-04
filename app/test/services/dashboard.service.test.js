import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/models/dashboard.model.js', () => ({
  getStats: jest.fn(),
  getPharmacists: jest.fn(),
  getRecentPrescriptions: jest.fn(),
}));

const model = await import('../../src/models/dashboard.model.js');
const service = await import('../../src/services/dashboard.service.js');

describe('dashboard.service (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getDashboardData aggregates data from model', async () => {
    model.getStats.mockResolvedValue([{ status: 'completed', count: 3 }]);
    model.getPharmacists.mockResolvedValue([{ id: 1, name: 'P' }]);
    model.getRecentPrescriptions.mockResolvedValue([{ id: 7 }]);

    const data = await service.getDashboardData();
    expect(model.getStats).toHaveBeenCalled();
    expect(model.getPharmacists).toHaveBeenCalled();
    expect(model.getRecentPrescriptions).toHaveBeenCalled();
    expect(data).toEqual(expect.objectContaining({
      stats: expect.any(Array),
      pharmacists: expect.any(Array),
      recent: expect.any(Array),
    }));
  });
});