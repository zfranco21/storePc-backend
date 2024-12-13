const User = require("../models/User");

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que email y password estén presentes
    if (!email || !password) {
      console.log("email y contraseña no recibidos");
      return res
        .status(400)
        .json({ error: "El email y la contraseña son obligatorios" });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar si el usuario está habilitado
    if (!user.isEnabled) {
      return res.status(403).json({
        error: "El usuario está deshabilitado. Contacte al administrador.",
      });
    }

    // Verificar la contraseña directamente
    if (password !== user.password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Responder con los datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
