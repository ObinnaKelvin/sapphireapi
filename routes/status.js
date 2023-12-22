import express from "express";
import { createStatus } from '../controllers/status.js';

const router = express.Router();

//CREATE
router.post('/', createStatus)

export default router;