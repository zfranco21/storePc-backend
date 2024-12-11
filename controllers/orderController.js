const Order = require("../models/Order");
const Product = require("../models/Product");

// Obtener todas las órdenes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user products.product"); // Popula los datos del usuario y productos
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

// Obtener una orden por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user products.product"
    );
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
};

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { user, products } = req.body;

    // Verificar que el usuario exista
    const userExists = await User.findById(user);
    if (!userExists)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Calcular el precio total de la orden
    let totalPrice = 0;
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product)
        return res
          .status(404)
          .json({ error: `Producto no encontrado: ${item.product}` });
      totalPrice += product.price * item.quantity;
    }

    // Crear la nueva orden
    const newOrder = new Order({
      user,
      products,
      totalPrice,
    });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: "Error al crear la orden" });
  }
};

// Actualizar una orden
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Devuelve el documento actualizado
    ).populate("user products.product");

    if (!updatedOrder)
      return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar la orden" });
  }
};

// Eliminar una orden
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json({ message: "Orden eliminada con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la orden" });
  }
};
