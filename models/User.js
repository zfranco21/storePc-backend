const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Para encriptar contraseñas

// Esquema de usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Para saber si el usuario es admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Encriptar la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
