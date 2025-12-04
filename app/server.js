import express from 'express';
import generalAdminRoutes from './src/routes/general-admin.routes.js';
import pharmacistAdminRoutes from './src/routes/pharmacist-admin.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/general-admin', generalAdminRoutes);
app.use('/api/pharmacist-admin', pharmacistAdminRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
