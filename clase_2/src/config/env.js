import dotenv from "dotenv";
// NODE_ENV
const environment = process.env.NODE_ENV || "development";
dotenv.config({
  path: environment === "production" ? ".env.production" : ".env",
});
export const env = {
  mode: environment,
  port: process.env.PORT || 4000,
  session_secret: process.env.SECRET,
  db_uri: process.env.DB_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_token: process.env.REFRESH_SECRET,
  github: {
    client_id: process.env.GITHUB_CLIENT_ID,
    secret_id: process.env.GITHUB_CLIENT_SECRET,
    callback_url: process.env.GITHUB_CALLBACK_URL,
  },
};
