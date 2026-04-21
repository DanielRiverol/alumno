import { Router } from "express";
import userModel from "../models/user.model.js";
import {
  authorizeRoles,
  registerGuard,
  passportAuthGuard,
} from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();

const requireAdmin = [passportAuthGuard, authorizeRoles([])];
const requireUser = [passportAuthGuard, authorizeRoles(["user"])];
const requirePremium = [passportAuthGuard, authorizeRoles(["premium"])];
const requireAll = [passportAuthGuard, authorizeRoles(["user", "premium"])];

router.get("/", requireAdmin, async (req, res) => {
  // Error forzado
  console.log(variableInexistente);

  const users = await userModel.find();
  res.status(200).json({ message: "Lista de usuarios", payload: users });
});

router.get("/profile", requireAll, async (req, res) => {
  res.status(200).json({ message: "Perfil del usuario", payload: req.user });
});

router.post("/", registerGuard, async (req, res) => {
  res
    .status(201)
    .json({ message: "Usuario creado correctamente", payload: req.user });
});

// USUARIO PREMIUM
router.get("/premium-content", requirePremium, (req, res) => {
  res.status(200).json({
    message: "¡Bienvenido a la zona VIP!",
    benefit: "Aquí tienes acceso a descargas ilimitadas y soporte prioritario.",
    user: req.user.email,
  });
});

// Delete (RUTA ADMIN)
router.delete("/:id", requireAdmin, async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado exitosamente" });
});

export default router;
