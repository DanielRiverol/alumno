import mongoose from "mongoose";
import { env } from "./env.js";

const { db_uri } = env;
export default async function connectDb() {
  try {
    await mongoose.connect(db_uri);
    console.log("Conexion establecida");
  } catch (error) {
    console.error(`Error al conectarse a la db: ${error.message} `);
  }
}
