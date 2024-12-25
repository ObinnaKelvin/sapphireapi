import express from "express";
import { exportAllPatientReport } from '../controllers/patientReport.js';

const router = express.Router();

//CREATE
router.post('/exportAllPatientReport', exportAllPatientReport)

export default router;