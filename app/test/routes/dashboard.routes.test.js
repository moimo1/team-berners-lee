import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

await jest.unstable_mockModule('../../src/services/dashboard.service.js', () => ({
  getDashboardData: jest.fn(),
}));

const dashboardService = await import('../../src/services/dashboard.service.js');
const dashboardRoutes = await import('../../src/routes/dashboard.routes.js');

describe('dashboard.routes (ESM)', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/pharma-admin/dashboard', dashboardRoutes.default);
  });

  afterEach(() => jest.clearAllMocks());

  test('GET / returns dashboard data', async () => {
    dashboardService.getDashboardData.mockResolvedValue({ stats: [], pharmacists: [], recent: [] });

    const res = await request(app).get('/api/pharma-admin/dashboard').expect(200);
    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toBeDefined();
  });
});