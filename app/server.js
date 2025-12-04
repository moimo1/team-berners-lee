import express from 'express';
import cors from 'cors';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import prescriptionRoutes from './src/routes/prescription.routes.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/pharma-admin/dashboard', dashboardRoutes);
app.use('/api/pharma-admin/prescriptions', prescriptionRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;
