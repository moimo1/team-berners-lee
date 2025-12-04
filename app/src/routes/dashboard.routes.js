import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import prescriptionRoutes from "./prescription.routes";

const router = express.Router();

router.get("/dashboard", getDashboard);
router.use('/prescriptions', prescriptionRoutes);

export default router;