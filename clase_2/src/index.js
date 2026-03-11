import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.router.js";
import connectDb from "./config/db.js";
dotenv.config();

//settings
const app = express();
app.set("PORT", process.env.PORT);
const secret = process.env.SECRET;
const fileStore = FileStore(session);

// middlewares
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
      mongoUrl: process.env.DB_URI,
      ttl: 60000,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  }),
);
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.json({ title: "Home Page" });
});

//listeners
connectDb();
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
