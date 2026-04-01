import { Router } from "express";
import userModel from "../models/user.model.js";
import { hashPassword } from "../utils/auth.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import passport from "passport";
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
// router.get("/profile", isAuth, async (req, res) => {
router.get(
  "/profile",
  passport.authenticate("session", { session: false }),
  async (req, res) => {
    try {
      // const user = req.session?.user;
      // if (!user)
      //   return res
      //     .status(401)
      //     .json({ message: "Debes iniciar sesion primero" });

      // res
      //   .status(200)
      //   .json({ message: "Perfil del usuario", payload: user });
      res
        .status(200)
        .json({ message: "Perfil del usuario", payload: req.user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  },
);

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const passHash = await hashPassword(password);
    const newUser = await userModel.create({ email, password: passHash });
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
