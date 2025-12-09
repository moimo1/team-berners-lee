import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pharma-admin/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});