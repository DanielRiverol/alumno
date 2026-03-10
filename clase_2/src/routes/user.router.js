import { Router } from "express";
import userModel from "../models/user.model.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ message: "Lista de usuarios", payload: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await userModel.create({ email, password });
    res
      .status(201)
      .json({ message: "Usuario creado correctamente", payload: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

export default router;
