import {Router} from 'express'
import { createRole, deleteRole, getRole, getRoles } from '../handler/rolehandler'

export const router = new Router()

router.get("/",getRoles)
router.get("/:id",getRole)
router.post("/",createRole)
router.delete("/:id",deleteRole)