import express from "express";
import { createNotification } from '../controllers/notifications.js';

const router = express.Router();

//CREATE
router.post('/', createNotification)



export default router;