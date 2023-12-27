import express from "express";
import { createService, readService, readServices } from '../controllers/service.js';

const router = express.Router();

//CREATE
router.post('/', createService)

//GET
router.get('/find/:id', readService)

//GET ALL
router.get('/', readServices)

//UPDATE
//router.put('/:id', updatePatient)

//DELETE
//router.delete('/:id', deletePatient)

export default router;