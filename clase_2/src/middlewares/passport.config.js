import passport from "passport";
import userModel from "../models/user.model.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "../config/env.js";

import { hashPassword } from "../utils/auth.js";

const { client_id, secret_id, callback_url } = env.github;

const initializePassport = () => {
  // Estaregia Locla de registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          let userRole = "user";
          // array de usuerios que vana ser admin
          if (email === "admin@mail.com") {
            userRole = "admin";
          }
          const user = await userModel.findOne({ email });

          //  verifico si existe TODO(en revision)
          if (user)
            return done(null, false, { message: "El usuario ya existe" });

          //  creo un nuevo usuario
          const passHash = await hashPassword(password);
          const newUser = await userModel.create({
            email,
            password: passHash,
            role: userRole,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  // Estrategia de JWT
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.jwt_secret,
      },
      async (jwt_payload, done) => {
        try {
          const userId = jwt_payload.id || jwt_payload._id;
          const user = await userModel.findById(userId).select("-password");
          // delete user.password

          if (!user) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  // Estrategia De github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: client_id,
        clientSecret: secret_id,
        callbackURL: callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email || `${profile.username}@github.com`;
          let user = await userModel.findOne({ email });

          if (!user) {
            user = await userModel.create({
              email: email,
              password: "oauth_github_user",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id).select("-password");

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;
