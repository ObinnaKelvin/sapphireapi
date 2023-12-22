import express from "express";
import { createAppointment, readAppointment, readAppointments } from '../controllers/appointment.js';

const router = express.Router();

//CREATE
router.post('/', createAppointment)

//GET
router.get('/find/:id', readAppointment)

//GET ALL
router.get('/', readAppointments)

//UPDATE
//router.put('/:id', updatePatient)

//DELETE
//router.delete('/:id', deletePatient)

export default router;