const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario que realiza la compra
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      }, // Referencia al producto
      quantity: { type: Number, required: true }, // Cantidad de producto
      price: { type: Number, required: true }, // Precio por unidad del producto
    },
  ],
  totalPrice: { type: Number, required: true }, // Precio total de la compra
  status: {
    type: String,
    enum: ["Pendiente", "Pagada", "Enviado", "Entregada", "Cancelada"],
    default: "Pendiente",
  }, // Estado de la orden
  adress: { type: String, required: true },
  telephone: { type: String, required: true },
  comment: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
