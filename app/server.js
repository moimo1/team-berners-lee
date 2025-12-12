import express from 'express';
import cors from 'cors';

import dashboardRoutes from './src/routes/dashboard.routes.js';
import prescriptionRoutes from './src/routes/prescriptions.routes.js';
import historyRoutes from './src/routes/pharmacist-history.routes.js';
import adminUserRoutes from './src/routes/admin-users.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pharma-admin/dashboard', dashboardRoutes);
app.use('/api/pharma-admin/prescriptions', prescriptionRoutes);
app.use('/api/pharma-admin/pharmacists', historyRoutes);
app.use('/api/admin', adminUserRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});