import express from "express";

import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.router.js";
import connectDb from "./config/db.js";
import initializePassport from "./middlewares/passport.config.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";
// console.log(env);

//settings
const app = express();
app.set("PORT", env.port);
const secret = env.session_secret;
const fileStore = FileStore(session);

// middlewares
initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(
//   session({
//     store: new fileStore({ path: "./sessions", ttl: 100, retries: 0 }),
//     secret,
//     resave: false,
//     saveUninitialized: false,
//   }),
// );
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: env.db_uri,
      ttl: 60000,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.session());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.json({ title: "Home Page" });
});

// Error 404 = Rutas no existentes
app.use((req, res) => {
  res.status(404).json({
    error: "No encontrado",
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
});
// manejador de errors
app.use(globalErrorHandler);
//listeners
connectDb();
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
