import express from 'express';
import cors from 'cors';
import dashboardRoutes from './src/routes/dashboard.routes.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/pharma-admin', dashboardRoutes);

app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);
