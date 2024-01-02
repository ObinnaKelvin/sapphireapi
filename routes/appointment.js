import express from "express";
import { createAppointment, readAppointment, readAppointmentByEmail, readAppointments } from '../controllers/appointment.js';

const router = express.Router();

//CREATE
router.post('/', createAppointment)

//GET
router.get('/find/:id', readAppointment)

//GET BY EMAIL
router.get('/findByEmail/:id', readAppointmentByEmail)

//GET ALL
router.get('/', readAppointments)

//UPDATE
//router.put('/:id', updatePatient)

//DELETE
//router.delete('/:id', deletePatient)

export default router;