import express from "express";
import { createPatient, readPatient, readPatients } from '../controllers/patient.js';

const router = express.Router();

//CREATE
router.post('/', createPatient)

//GET
router.get('/find/:id', readPatient)

//GET ALL
router.get('/', readPatients)

export default router;