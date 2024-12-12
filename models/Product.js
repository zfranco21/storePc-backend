const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: {
    // Referencia a la categoría
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Nombre del modelo de categoría
    required: true, // La categoría es obligatoria
  },
  image: { type: String }, // URL de la imagen
  isEnabled: { type: Boolean, default: true }, // Estado del producto
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
