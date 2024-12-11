const mongoose = require("mongoose");

// Esquema de usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Para saber si el usuario es admin
  isEnabled: { type: Boolean, default: true }, // Para saber si el usuario está habilitado
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Método para comparar la contraseña ingresada con la almacenada (ahora solo comparando directamente las cadenas)
userSchema.methods.matchPassword = function (enteredPassword) {
  return enteredPassword === this.password; // Comparación directa
};

module.exports = mongoose.model("User", userSchema);
