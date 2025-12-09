import express from 'express';
import cors from 'cors';

import dashboardRoutes from './src/routes/dashboard.routes.js';
import prescriptionRoutes from './src/routes/prescriptions.routes.js'; 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pharma-admin/dashboard', dashboardRoutes);
app.use('/api/pharma-admin/prescriptions', prescriptionRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});