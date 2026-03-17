import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.REFRESH_SECRET);
