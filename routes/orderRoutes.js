const express = require("express");
const { check, param, query } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Rutas para el CRUD de órdenes
router.get("/", orderController.getAllOrders);

router.get(
  "/:id",
  [param("id", "ID de la orden inválido").isMongoId(), validateFields],
  orderController.getOrderById
);

router.post(
  "/",
  [
    check("user", "El ID del usuario es obligatorio").isMongoId(),
    check("products", "Los productos son obligatorios y deben ser un array")
      .isArray()
      .notEmpty(),
    check("products.*.product", "Cada producto debe tener un ID válido")
      .isMongoId()
      .notEmpty(),
    check("products.*.quantity", "Cada producto debe tener una cantidad válida")
      .isInt({ min: 1 })
      .notEmpty(),
    check("adress", "La dirección es obligatoria").notEmpty(),
    check("telephone", "El teléfono es obligatorio").notEmpty(),
    check("totalPrice", "El precio total debe ser un número positivo").isFloat({
      min: 0,
    }),
    validateFields,
  ],
  orderController.createOrder
);

router.put(
  "/:id",
  [
    param("id", "ID de la orden inválido").isMongoId(),
    check("user", "El ID del usuario es obligatorio").isMongoId(),
    check("products", "Los productos son obligatorios y deben ser un array")
      .isArray()
      .notEmpty(),
    check("products.*.product", "Cada producto debe tener un ID válido")
      .isMongoId()
      .notEmpty(),
    check("products.*.quantity", "Cada producto debe tener una cantidad válida")
      .isInt({ min: 1 })
      .notEmpty(),
    check("adress", "La dirección es obligatoria").notEmpty(),
    check("telephone", "El teléfono es obligatorio").notEmpty(),
    check("totalPrice", "El precio total debe ser un número positivo").isFloat({
      min: 0,
    }),
    validateFields,
  ],
  orderController.updateOrder
);

router.delete(
  "/:id",
  [param("id", "ID de la orden inválido").isMongoId(), validateFields],
  orderController.deleteOrder
);

// Rutas específicas
router.get(
  "/user/:userId",
  [param("userId", "ID de usuario inválido").isMongoId(), validateFields],
  orderController.getOrdersByUser
);

router.put(
  "/:orderId/status",
  [
    param("orderId", "ID de la orden inválido").isMongoId(),
    check("status", "Estado inválido").isIn([
      "Pendiente",
      "Pagada",
      "Enviado",
      "Entregada",
      "Cancelada",
    ]),
    validateFields,
  ],
  orderController.updateOrderStatus
);

router.get(
  "/filter",
  [
    query("status", "Estado inválido").isIn([
      "Pendiente",
      "Pagada",
      "Enviado",
      "Entregada",
      "Cancelada",
    ]),
    validateFields,
  ],
  orderController.getOrdersByStatus
);

router.get(
  "/:orderId/summary",
  [param("orderId", "ID de la orden inválido").isMongoId(), validateFields],
  orderController.getOrderSummary
);

router.get("/statistics", orderController.getOrderStatistics);

module.exports = router;
