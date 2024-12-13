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

// Obtener todas las órdenes por usuario
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Obtener el ID del usuario desde los parámetros de la ruta

    // Buscar órdenes del usuario
    const orders = await Order.find({ user: userId })
      .populate("user", "name email") // Popula información básica del usuario
      .populate("products.product", "name price") // Popula información básica del producto
      .exec();

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron órdenes para este usuario." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes por usuario:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al obtener las órdenes." });
  }
};

// Actualizar el estado de una orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // ID de la orden desde los parámetros
    const { status } = req.body; // Nuevo estado desde el cuerpo de la solicitud

    // Validar que el estado proporcionado es uno de los permitidos
    const validStatuses = [
      "Pendiente",
      "Pagada",
      "Enviado",
      "Entregada",
      "Cancelada",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Estado inválido. Los estados permitidos son: " +
          validStatuses.join(", "),
      });
    }

    // Buscar y actualizar la orden
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() }, // Actualiza el estado y la fecha de actualización
      { new: true } // Retorna el documento actualizado
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    res.status(200).json({
      message: "Estado de la orden actualizado exitosamente.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    res.status(500).json({
      message: "Error del servidor al actualizar el estado de la orden.",
    });
  }
};

// Filtrar órdenes por estado
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query; // Obtener el estado desde la consulta de la URL

    // Validar que el estado proporcionado es válido
    const validStatuses = [
      "Pendiente",
      "Pagada",
      "Enviado",
      "Entregada",
      "Cancelada",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Estado inválido. Los estados permitidos son: " +
          validStatuses.join(", "),
      });
    }

    // Buscar órdenes con el estado proporcionado
    const orders = await Order.find({ status })
      .populate("user", "name email") // Opcional: incluir información del usuario
      .populate("products.product", "name price") // Opcional: incluir información de los productos
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No se encontraron órdenes con el estado proporcionado.",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al filtrar órdenes por estado:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al filtrar las órdenes." });
  }
};

// Resumen de una orden
exports.getOrderSummary = async (req, res) => {
  try {
    const { orderId } = req.params; // ID de la orden desde los parámetros

    // Buscar la orden por ID
    const order = await Order.findById(orderId)
      .populate("user", "name email") // Información del usuario
      .populate("products.product", "name price") // Información de los productos
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    // Construir el resumen
    const summary = {
      orderId: order._id,
      user: {
        name: order.user.name,
        email: order.user.email,
      },
      products: order.products.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: order.totalPrice,
      address: order.adress,
      telephone: order.telephone,
      status: order.status,
      createdAt: order.createdAt,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error al generar el resumen de la orden:", error);
    res.status(500).json({
      message: "Error del servidor al generar el resumen de la orden.",
    });
  }
};

// Estadísticas de órdenes
exports.getOrderStatistics = async (req, res) => {
  try {
    // Obtener estadísticas de las órdenes
    const totalOrders = await Order.countDocuments(); // Número total de órdenes
    const completedOrders = await Order.countDocuments({ status: "Entregada" }); // Órdenes completadas
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const averageSpending = totalRevenue[0]?.total / totalOrders || 0; // Gasto promedio por orden

    // Devolver las estadísticas
    res.status(200).json({
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageSpending,
    });
  } catch (error) {
    console.error("Error al obtener las estadísticas de las órdenes:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al obtener estadísticas." });
  }
};
