import userModel from "../models/user.model.js";

export const getAll = async (req, res) => {
  // Error forzado
  // console.log(variableInexistente);

  const users = await userModel.find();
  res.status(200).json({ message: "Lista de usuarios", payload: users });
};


export const getProfile = async (req, res) => {
  res.status(200).json({ message: "Perfil del usuario", payload: req.user });
};

export const create = async (req, res) => {
  res
    .status(201)
    .json({ message: "Usuario creado correctamente", payload: req.user });
};

export const getPremium = async (req, res) => {
  res.status(200).json({
    message: "¡Bienvenido a la zona VIP!",
    benefit: "Aquí tienes acceso a descargas ilimitadas y soporte prioritario.",
    user: req.user.email,
  });
};

export const deleteUser = async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado exitosamente" });
};