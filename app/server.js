import express from 'express';
import cors from 'cors';

import dashboardRoutes from './src/routes/dashboard.routes.js';
import prescriptionRoutes from './src/routes/prescription.routes.js';
import pharmacistRoutes from './src/routes/pharmacist.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.use(express.json());

app.use('/api/pharma-admin/dashboard', dashboardRoutes);
app.use('/api/pharma-admin/prescriptions', prescriptionRoutes);
app.use('/api/pharma-admin/pharmacists', pharmacistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
