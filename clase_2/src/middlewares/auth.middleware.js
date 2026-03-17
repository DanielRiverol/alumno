import { verifyAccessToken } from "../utils/jwt.js";

export const isAuth = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.status(401).json({ message: "NO autenticado" });

  const token = authHeaders.split(" ")[1]; // "Bearer jkhskjhdiuyeiuwbr"

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next()
  } catch (error) {
    res.status(403).json({ message: "Token invalido o corrupto" });
  }
};
