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

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "El usuario ya existe" });

    // Crear el nuevo usuario
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: "Error al crear el usuario" });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Devuelve el documento actualizado
    );
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
