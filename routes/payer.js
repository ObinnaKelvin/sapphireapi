import express from "express";
import { createPayer } from '../controllers/payer.js';

const router = express.Router();

//CREATE
router.post('/', createPayer)

export default router;