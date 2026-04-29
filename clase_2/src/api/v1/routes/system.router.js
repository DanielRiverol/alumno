import { Router } from "express";
import { createBackup } from "../controllers/system.controller.js";
const router = Router()


router.post('/backup',createBackup)

export default router