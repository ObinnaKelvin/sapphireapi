import express from "express";
import { createStatus, readStatus, readStatuses } from '../controllers/status.js';

const router = express.Router();

//CREATE
router.post('/', createStatus)

//GET
router.get('/find/:id', readStatus)

//GET ALL
router.get('/', readStatuses)

//UPDATE
//router.put('/:id', updateStatus)

//DELETE
//router.delete('/:id', deleteStatus)

export default router;