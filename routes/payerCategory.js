import express from "express";
import { createPayerCategory } from '../controllers/payerCategory.js';

const router = express.Router();

//CREATE
router.post('/', createPayerCategory)

export default router;