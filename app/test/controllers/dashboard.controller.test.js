import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/services/dashboard.service.js', () => ({
  getDashboardData: jest.fn(),
}));

const dashboardService = await import('../../src/services/dashboard.service.js');
const controller = await import('../../src/controllers/dashboard.controller.js');

describe('dashboard.controller (ESM)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getDashboard returns aggregated data', async () => {
    dashboardService.getDashboardData.mockResolvedValue({ stats: [], pharmacists: [], recent: [] });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await controller.getDashboard(req, res);

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.any(Object) }));
  });

  test('getDashboard handles errors', async () => {
    dashboardService.getDashboardData.mockRejectedValue(new Error('boom'));
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await controller.getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
});