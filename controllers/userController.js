const User = require("../models/User");

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Buscar un usuario por email
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Habilitar o deshabilitar un usuario
exports.enableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.isEnabled = !user.isEnabled;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar al usuario" });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el usuario" });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
