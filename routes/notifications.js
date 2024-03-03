import express from "express";
import { createNotification, readNotifications } from '../controllers/notifications.js';

const router = express.Router();

//CREATE
router.post('/', createNotification)

//READ ALL
router.get('/', readNotifications)



export default router;