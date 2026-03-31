import passport, { use } from "passport";
import userModel from "../models/user.model.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "../config/env.js";

const { client_id, secret_id, callback_url } = env.github;

const initializePassport = () => {
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
          let user = await userModel.find({ email });
          if (!user) {
            user = await userModel.create({
              email: email,
              password: "password_generico",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id); // depende de la db que use
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default initializePassport;
