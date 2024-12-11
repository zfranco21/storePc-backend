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

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body; // Extraer el email del cuerpo de la solicitud

    // Validar que el email esté presente en el cuerpo de la solicitud
    if (!email) {
      return res
        .status(400)
        .json({ error: "Se requiere un email en el cuerpo de la solicitud" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }); // Normalizar el email

    // Si el usuario no fue encontrado, devolver un error 404
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Responder con los detalles del usuario
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error); // Log para depuración
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, isEnabled } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe y si está deshabilitado
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isEnabled === false) {
        return res.status(400).json({
          error:
            "Usuario deshabilitado por administrador, contacte con mesa de ayuda",
        });
      }
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Crear el nuevo usuario
    const newUser = new User({ name, email, password, isEnabled });
    const savedUser = await newUser.save();

    // Responder con el usuario creado (sin incluir la contraseña)
    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isEnabled: savedUser.isEnabled,
    });
  } catch (err) {
    console.error(err); // Log para depuración
    res.status(500).json({ error: "Error al crear el usuario" });
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
