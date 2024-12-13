const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Rutas para el CRUD de órdenes
router.get("/", orderController.getAllOrders); // Obtener todas las órdenes
router.get("/:id", orderController.getOrderById); // Obtener una orden por ID
router.post("/", orderController.createOrder); // Crear una nueva orden
router.put("/:id", orderController.updateOrder); // Actualizar una orden
router.delete("/:id", orderController.deleteOrder); // Eliminar una orden
// Rutas especificas
router.get("/user/:userId", orderController.getOrdersByUser); // obtener ordenes asociadas a un id de usuario
router.put("/:orderId/status", orderController.updateOrderStatus); // actualiza el estado de una orden
router.get("/filter", orderController.getOrdersByStatus); // filtra órdenes por estado
router.get("/:orderId/summary", orderController.getOrderSummary); // resumen detallado de orden
router.get("/statistics", orderController.getOrderStatistics); // Obtener estadisticas de ordenes.
module.exports = router;
