import express from "express";
import { createTariff, readTariff, readTariffs } from '../controllers/tariff.js';

const router = express.Router();

//CREATE
router.post('/', createTariff)

//GET
router.get('/find/:id', readTariff)

//GET ALL
router.get('/', readTariffs)

//UPDATE
//router.put('/:id', updatePatient)

//DELETE
//router.delete('/:id', deletePatient)

export default router;