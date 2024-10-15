import express from "express";
import { createAppointment, readAppointment, readAppointmentByEmail, readAppointmentByEmailByAppointmentDateGTEToday, readAppointmentByEmailByAppointmentDateLTToday, readAppointments, updateAppointment } from '../controllers/appointment.js';

const router = express.Router();

//CREATE
router.post('/', createAppointment)

//GET
router.get('/find/:id', readAppointment)

//GET BY EMAIL
router.get('/findByEmail/:id', readAppointmentByEmail)

//GET BY EMAIL BY APPOINTMENT DATE >= TODAY
router.get('/findByEmailByAppointDateGTE/:id', readAppointmentByEmailByAppointmentDateGTEToday)

//GET BY EMAIL BY APPOINTMENT DATE < TODAY
router.get('/findByEmailByAppointDateLT/:id', readAppointmentByEmailByAppointmentDateLTToday)

//GET ALL
router.get('/', readAppointments)

//UPDATE
router.put('/set/:id', updateAppointment)

//DELETE
//router.delete('/:id', deletePatient)

export default router;