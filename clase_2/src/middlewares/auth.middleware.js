import passport from "passport";

// register
export const registerGuard = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      console.warn(
        `[LOGGER DE SEGURIDAD] Falló el registro, Razón: ${info?.message} `,
      );
      return res
        .status(400)
        .json({ message: info?.message || "Error al registrar" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Login
export const passportAuthGuard = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // capturamos el mensaje
      const reason = info ? info.name || info.message : "Falta token";
      console.warn(
        `[LOGGER DE SEGURIDAD] Falló el registro, Razón: ${reason} `,
      );

      if (reason === "TokenExpiredError") {
        return res.status(401).json({
          message: "Tu sesión ha expirado. Inicia sesión nuevamente",
          detail_error: reason,
        });
      }
      return res.status(401).json({
        message: "No estas autenticado, Incia sesión o proporciona un token",
        detail_error: reason,
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // verificar que exuista req.user
    if (!req.user) return res.status(401).json({ message: "NO autenticado" });

    if (req.user.role === "admin" || roles.includes(req.user.role))
      return next();

    return res
      .status(403)
      .json({ message: "Acceso denegado. No tenes los permisos suficientes" });
  };
};
