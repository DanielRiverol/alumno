import mongoose from "mongoose";

export default async function connectDb() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sessions");
    console.log("Conexion establecida");
  } catch (error) {
    console.error(`Error al conectarse a la db: ${error.message} `);
  }
}
