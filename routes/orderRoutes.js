const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Rutas para el CRUD de órdenes
router.get("/", orderController.getAllOrders); // Obtener todas las órdenes
router.get("/:id", orderController.getOrderById); // Obtener una orden por ID
router.post("/", orderController.createOrder); // Crear una nueva orden
router.put("/:id", orderController.updateOrder); // Actualizar una orden
router.delete("/:id", orderController.deleteOrder); // Eliminar una orden

module.exports = router;
