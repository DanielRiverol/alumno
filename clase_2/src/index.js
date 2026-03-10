import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRoutes from "./routes/user.router.js";
dotenv.config();

//settings
const app = express();
app.set("PORT", process.env.PORT);
const secret = process.env.SECRET;


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
  }),
);
//routes
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.json({ title: "Home Page" });
});

//listeners
connectDb();
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
