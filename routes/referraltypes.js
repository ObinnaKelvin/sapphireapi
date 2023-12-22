import express from "express";
import { createReferralType } from '../controllers/referralType.js';

const router = express.Router();

//CREATE
router.post('/', createReferralType)

export default router;