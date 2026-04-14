import { Router } from "express";
import userModel from "../models/user.model.js";
import { authorizeRoles,registerGuard } from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();

const authenticate = passport.authenticate(["jwt", "session"], {
  session: false,
});
const requireAdmin = [authenticate, authorizeRoles([])];
const requireUser = [authenticate, authorizeRoles(["user"])];
const requirePremium = [authenticate, authorizeRoles(["premium"])];
const requireAll = [authenticate, authorizeRoles(["user", "premium"])];

router.get("/", requireAdmin, async (req, res) => {
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
router.get("/profile", requireAll, async (req, res) => {
  try {
    // const user = req.session?.user;
    // if (!user)
    //   return res
    //     .status(401)
    //     .json({ message: "Debes iniciar sesion primero" });

    // res
    //   .status(200)
    //   .json({ message: "Perfil del usuario", payload: user });
    res.status(200).json({ message: "Perfil del usuario", payload: req.user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});
// // v1
// router.post("/", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const passHash = await hashPassword(password);
//     const newUser = await userModel.create({ email, password: passHash });
//     res
//       .status(201)
//       .json({ message: "Usuario creado correctamente", payload: newUser });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error interno del servidor", error: error.message });
//   }
// });

//v2 passport-local
router.post(
  "/",
  registerGuard,
  async (req, res) => {
    try {
      res
        .status(201)
        .json({ message: "Usuario creado correctamente", payload: req.user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  },
);

router.delete(
  "/:id",
  passport.authenticate(["jwt", "session"], { session: false }),
  authorizeRoles([]),
  async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
    }
  },
);

export default router;
