import express from 'express'

import { getUser, getUsers, updateUser, deleteUser } from '../controllers/user.js'

const router = express.Router();

//CREATE
// router.post('/', createCategory);

//GET
router.get('/:id', getUser)

//GET ALL
router.get('/', getUsers)

//UPDATE
router.put('/:id', updateUser)

//DELETE
router.delete('/:id', deleteUser)

export default router;