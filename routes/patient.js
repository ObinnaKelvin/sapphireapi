import express from "express";
import { createPatient, readPatient, readPatients, updatePatient, deletePatient } from '../controllers/patient.js';

const router = express.Router();

//CREATE
router.post('/', createPatient)

//GET
router.get('/find/:id', readPatient)

//GET ALL
router.get('/', readPatients)

//UPDATE
router.put('/:id', updatePatient)

//DELETE
router.delete('/:id', deletePatient)

export default router;