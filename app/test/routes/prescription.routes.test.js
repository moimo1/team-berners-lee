import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

await jest.unstable_mockModule('../../src/services/prescription.service.js', () => ({
  searchPrescriptions: jest.fn(),
  getPrescriptionDetails: jest.fn(),
}));

const prescriptionService = await import('../../src/services/prescription.service.js');
const prescriptionRoutes = await import('../../src/routes/prescription.routes.js');

describe('prescription.routes (ESM)', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/pharma-admin/prescriptions', prescriptionRoutes.default);
  });

  afterEach(() => jest.clearAllMocks());

  test('GET /search returns results', async () => {
    prescriptionService.searchPrescriptions.mockResolvedValue([{ id: 1 }]);

    const res = await request(app)
      .get('/api/pharma-admin/prescriptions/search')
      .query({ patient: 'A' })
      .expect(200);

    expect(prescriptionService.searchPrescriptions).toHaveBeenCalledWith(expect.objectContaining({ patient: 'A' }));
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test('GET /:id returns 404 when missing', async () => {
    prescriptionService.getPrescriptionDetails.mockResolvedValue(null);
    const res = await request(app).get('/api/pharma-admin/prescriptions/999').expect(404);
    expect(res.body.success).toBe(false);
  });
});