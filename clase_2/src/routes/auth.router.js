import { Router } from "express";
import passport from "passport";
import { generateTokens } from "../utils/jwt.js";
import { comparePassword } from "../utils/auth.js";
import { validateLogin } from "../middlewares/validator.middleware.js";
import userModel from "../models/user.model.js";
import { env } from "../config/env.js";
const router = Router();

// PASSORT GITHUB
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api/users/profile");
  },
);

// LOGIN
router.post("/login", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    const isValidPassword = await comparePassword(password, user.password);

    if (!user || !isValidPassword)
      return res.status(401).json({ message: "Email o passowod invalidos" });
    // TOKENS
    const { accessToken, refreshToken } = generateTokens(user);
    req.session.user = {
      id: user._id,
      email: user.email,
    };

    const isMobile = req.body.client === "mobile";
    if (isMobile) {
      return res
        .status(200)
        .json({
          message: "Login exitos (Mobile)",
          accessToken,
          refreshToken,
          user: req.session.user,
        });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.mode === "production",
      sameSite: "lax", //'strict'
      maxAge: 7 * 24 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.mode === "production",
      sameSite: "lax", //'strict'
      maxAge: 7 * 24 * 60 * 1000,
    });
    //

    res.status(200).json({
      message: "Sesion iniciada",

      user: req.session.user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

// Refresh token
router.post('/refresh', async(req,res)=>{
  const token= req.cookies?.refreshToken || req.body?.refreshToken

  if(!token)return res.status(401).json({message: "No hay refreshToken"})

    try {
      

      const {accessToken} =generateTokens(user)




      
    } catch (error) {
      res.status(403).json({ message: "Refresh token inválido o expirado." });
    }
})

// Logout
router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerrar sesion" });
    res.clearCookie("connect.sid");
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Sesion cerrada" });
  });
});

export default router;
