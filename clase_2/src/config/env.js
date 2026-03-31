import dotenv from "dotenv";
dotenv.config();
export const env = {
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
