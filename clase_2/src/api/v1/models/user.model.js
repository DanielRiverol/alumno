import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
});

export default model("User", UserSchema);
