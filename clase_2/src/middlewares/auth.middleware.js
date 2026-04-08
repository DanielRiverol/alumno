import { verifyAccessToken } from "../utils/jwt.js";
// obsoleto
// export const isAuth = (req, res, next) => {
//   const authHeaders = req.headers.authorization;
//   if (!authHeaders) return res.status(401).json({ message: "NO autenticado" });

//   const token = authHeaders.split(" ")[1]; // "Bearer jkhskjhdiuyeiuwbr"

//   try {
//     const decoded = verifyAccessToken(token);
//     req.user = decoded;
//     next()
//   } catch (error) {
//     res.status(403).json({ message: "Token invalido o corrupto" });
//   }
// };

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // verificar que exuista req.user
    if (!req.user) return res.status(401).json({ message: "NO autenticado" });

    if (req.user.role === "admin" || roles.includes(req.user.role))
      return next();

    return res.status(403).json({message:"Acceso denegado. No tenes los permisos suficientes"})
  };
};
