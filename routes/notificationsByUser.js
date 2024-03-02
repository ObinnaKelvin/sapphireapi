import express from "express";
import { createNotificationsByUser } from '../controllers/notificationsByUser.js';

const router = express.Router();

//CREATE
router.post('/', createNotificationsByUser)



export default router;