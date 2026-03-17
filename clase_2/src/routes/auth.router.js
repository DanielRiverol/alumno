import { Router } from "express";
import { comparePassword } from "../utils/auth.js";
import userModel from "../models/user.model.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // validar si recibimos todos los datos

    const user = await userModel.findOne({ email });
    const isValidPassword = await comparePassword(password, user.password)
    
    if (!user || !isValidPassword)
      return res.status(401).json({ message: "Email o passowod invalidos" });

    req.session.user = {
      id: user._id,
      email: user.email,
    };

    res
      .status(200)
      .json({ message: "Sesion iniciada", user: req.session.user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerra sesion" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Sesion cerrada" });
  });
});
export default router;
