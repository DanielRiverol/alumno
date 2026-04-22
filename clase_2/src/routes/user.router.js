import { Router } from "express";
// import userModel from "../models/user.model.js";
import { getAll, getProfile, create, getPremium } from "../controllers/user.controller.js";
import {
  authorizeRoles,
  registerGuard,
  passportAuthGuard,
} from "../middlewares/auth.middleware.js";

const router = Router();

const requireAdmin = [passportAuthGuard, authorizeRoles([])];
const requireUser = [passportAuthGuard, authorizeRoles(["user"])];
const requirePremium = [passportAuthGuard, authorizeRoles(["premium"])];
const requireAll = [passportAuthGuard, authorizeRoles(["user", "premium"])];

router.get("/", requireAdmin, getAll);

router.get("/profile", requireAll, getProfile);

router.post("/", registerGuard, create);

// USUARIO PREMIUM
router.get("/premium-content", requirePremium, getPremium);

// Delete (RUTA ADMIN)
router.delete("/:id", requireAdmin, async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado exitosamente" });
});

export default router;
