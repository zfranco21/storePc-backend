const mongoose = require("mongoose");

// Esquema de categoría
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Nombre único de la categoría
  description: { type: String }, // Descripción opcional de la categoría
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);
